import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, loadCartFromDB } from "../redux/slices/cartSlice";
import { getAllProducts } from "../redux/slices/productSlice";
import { toast } from "react-toastify";
import "../css/ProductDetails.css";
import { FaHeart } from "react-icons/fa";

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.product);
  const product = products.find((item) => item._id === id);
  const userId = JSON.parse(localStorage.getItem("user"))?.userId;

  const [selectedImage, setSelectedImage] = useState(null);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const magnifierRef = useRef(null);

  const [favorites, setFavorites] = useState([]);
  const isFavorite = favorites.includes(product?._id);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(getAllProducts());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    if (!userId || !product?._id) return;

    fetch(`http://localhost:5000/api/favorites/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const favIds = data.map((f) => f.productId);
        setFavorites(favIds);
      });
  }, [userId, product?._id]);

  const handleToggleFavorite = async () => {
    if (!userId || !product?._id) return;

    const url = isFavorite
      ? "http://localhost:5000/api/favorites/remove"
      : "http://localhost:5000/api/favorites/add";

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId: product._id }),
    });

    setFavorites((prev) =>
      isFavorite
        ? prev.filter((id) => id !== product._id)
        : [...prev, product._id]
    );
  };

  const handleAddToCart = async () => {
    dispatch(addToCart(product));
    toast.success("Product successfully added to cart 🛍️");

    if (!userId) return;

    await fetch("http://localhost:5000/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        productId: product._id,
        quantity: 1,
      }),
    });
  };

  useEffect(() => {
    if (product?.image?.length > 0) {
      setSelectedImage(product.image[0]);
    }
  }, [product]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        magnifierRef.current &&
        !magnifierRef.current.contains(e.target) &&
        e.target.id !== "magnifier-img"
      ) {
        setShowMagnifier(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!showMagnifier) return;

    const img = document.getElementById("magnifier-img");
    const glass = document.getElementById("magnifier-glass");
    if (!img || !glass) return;

    const zoom = 2;

    const setUpGlass = () => {
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      glass.style.backgroundImage = `url(${img.src})`;
      glass.style.backgroundRepeat = "no-repeat";
      glass.style.backgroundSize = `${naturalWidth * zoom}px ${
        naturalHeight * zoom
      }px`;
    };

    const getCursorPos = (e) => {
      const rect = img.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const moveMagnifier = (e) => {
      e.preventDefault();
      const pos = getCursorPos(e);
      const w = glass.offsetWidth / 2;
      const h = glass.offsetHeight / 2;
      const x = Math.max(Math.min(pos.x, img.width - w / zoom), w / zoom);
      const y = Math.max(Math.min(pos.y, img.height - h / zoom), h / zoom);

      glass.style.left = `${x - w}px`;
      glass.style.top = `${y - h}px`;
      glass.style.backgroundPosition = `-${x * zoom - w}px -${y * zoom - h}px`;
    };

    if (img.complete) {
      setUpGlass();
    } else {
      img.onload = setUpGlass;
    }

    img.addEventListener("mousemove", moveMagnifier);
    glass.addEventListener("mousemove", moveMagnifier);

    return () => {
      img.removeEventListener("mousemove", moveMagnifier);
      glass.removeEventListener("mousemove", moveMagnifier);
    };
  }, [selectedImage, showMagnifier]);

  if (!product)
    return <p style={{ textAlign: "center" }}>Loading product details...</p>;

  return (
    <div className="details-container">
      <div className="image-section">
        <div className="magnifier-container" ref={magnifierRef}>
          <img
            src={`/images/${selectedImage}`}
            alt={product.title}
            className="magnifier-image"
            id="magnifier-img"
            onClick={() => setShowMagnifier(!showMagnifier)}
            style={{ cursor: "zoom-in" }}
          />

          {showMagnifier && (
            <div className="magnifier-glass" id="magnifier-glass"></div>
          )}

          <button onClick={handleToggleFavorite} className="favorite-button">
            <FaHeart
              className={`heart-icon ${isFavorite ? "favorited" : ""}`}
            />
          </button>
        </div>

        <div className="thumbnail-container">
          {product.image.map((img, idx) => (
            <img
              key={idx}
              src={`/images/${img}`}
              alt={`thumb-${idx}`}
              className={`thumbnail ${selectedImage === img ? "active" : ""}`}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>

      <div className="info-section">
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <strong>${product.price}</strong>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart 🛍️
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;
