import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import "../css/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.product);
  const product = products.find((item) => item._id === id);

  const [selectedImage, setSelectedImage] = useState(null);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const magnifierRef = useRef(null);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success("Product successfully added to cart 🛍️");
  };

  useEffect(() => {
    if (product?.image.length > 0) {
      setSelectedImage(product.image[0]);
    }
  }, [product?.image]);

  // Dışarı tıklama kontrolü
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

  // Büyüteç ayarı
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
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      return { x, y };
    };

    const moveMagnifier = (e) => {
      e.preventDefault();
      const pos = getCursorPos(e);
      let x = pos.x;
      let y = pos.y;

      const w = glass.offsetWidth / 2;
      const h = glass.offsetHeight / 2;

      if (x > img.width - w / zoom) x = img.width - w / zoom;
      if (x < w / zoom) x = w / zoom;
      if (y > img.height - h / zoom) y = img.height - h / zoom;
      if (y < h / zoom) y = h / zoom;

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

  return (
    <div className="details-container">
      <div className="image-section">
        <div className="magnifier-container" ref={magnifierRef}>
          <img
            src={`/images/${selectedImage}`}
            alt={product?.title}
            className="magnifier-image"
            id="magnifier-img"
            onClick={() => setShowMagnifier(!showMagnifier)}
            style={{ cursor: "zoom-in" }}
          />
          {showMagnifier && (
            <div className="magnifier-glass" id="magnifier-glass"></div>
          )}
        </div>

        <div className="thumbnail-container">
          {Array.isArray(product?.image) &&
            product.image.map((img, idx) => (
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
        <h2>{product?.title}</h2>
        <p>{product?.description}</p>
        <strong>${product?.price}</strong>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart 🛍️
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;
