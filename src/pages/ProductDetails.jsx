import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { getAllProducts } from "../redux/slices/productSlice";
import { toast } from "react-toastify";
import "../css/ProductDetails.css";
import { FaHeart } from "react-icons/fa";

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.product);

  const product = useMemo(
    () => products.find((item) => item._id?.toString() === id),
    [products, id]
  );

  const userId = JSON.parse(localStorage.getItem("user"))?.userId;

  const [selectedImage, setSelectedImage] = useState(null);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const magnifierRef = useRef(null);
  const [favorites, setFavorites] = useState([]);
  const isFavorite = product && favorites.includes(product._id);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

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
    if (product?.sizes?.length > 0 && !selectedSize) {
      toast.warning("Please choose size🩷.");
      return;
    }

    const productWithSize = {
      ...product,
      selectedSize: selectedSize || "standard",
      selectedColor: selectedColor || "default",
    };

    dispatch(addToCart(productWithSize));
    toast.success("Product successfully added to cart 🛍️");

    if (!userId) return;

    await fetch("http://localhost:5000/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        productId: product._id,
        quantity: 1,
        selectedSize: selectedSize || "standard",
        selectedColor: selectedColor || "default",
      }),
    });
  };

  useEffect(() => {
    if (product?.image) {
      const first = Array.isArray(product.image)
        ? product.image[0]
        : product.image;
      setSelectedImage(first);
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
    if (!showMagnifier || !selectedImage) return;

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
        x: e.pageX - rect.left - window.scrollX,
        y: e.pageY - rect.top - window.scrollY,
      };
    };

    const moveMagnifier = (e) => {
      e.preventDefault();
      const pos = getCursorPos(e);
      const w = glass.offsetWidth / 2;
      const h = glass.offsetHeight / 2;

      let x = pos.x;
      let y = pos.y;

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
  }, [showMagnifier, selectedImage]);

  if (!product)
    return <p style={{ textAlign: "center" }}>Loading product details...</p>;

  const imageArray = Array.isArray(product.image)
    ? product.image
    : product.image
    ? [product.image]
    : [];

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
          {imageArray.map((img, idx) => (
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

        {/* SIZE SEÇİMİ */}
        {product?.sizes?.length > 0 && (
          <div className="size-selection">
            <p>Choose Size:</p>
            <div className="size-options">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`size-btn ${
                    selectedSize === size ? "selected" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* COLOR SEÇİMİ */}
        {product?.colors?.length > 0 && (
          <div className="color-selection">
            <p>Choose Color:</p>
            <div className="color-options">
              {product.colors.map((color) => (
                <button
                  key={color}
                  className={`color-btn ${
                    selectedColor === color ? "selected" : ""
                  }`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart 🛍️
        </button>

        <ProductReviews productId={product._id} />
      </div>
    </div>
  );
}

function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`http://localhost:5000/api/reviews/${productId}`)
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, [productId]);

  const handleSubmit = async () => {
    if (!newReview.rating || !newReview.comment.trim()) {
      toast.warning("Lütfen yorum ve puan girin.");
      return;
    }

    setSubmitting(true);

    const res = await fetch(`http://localhost:5000/api/reviews/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.userId,
        rating: newReview.rating,
        comment: newReview.comment,
      }),
    });

    const result = await res.json();
    if (res.ok) {
      setReviews((prev) => [...prev, result]);
      setNewReview({ rating: 0, comment: "" });
      toast.success("Yorum başarıyla eklendi!");
    } else {
      toast.error(result.error || "Yorum eklenemedi.");
    }

    setSubmitting(false);
  };

  return (
    <div className="review-section">
      <h3>Product Reviews</h3>

      {reviews.length === 0 && <p>No comments yet.</p>}
      {reviews.map((r, i) => (
        <div key={i} className="review-card">
          <p>
            <strong>
              {r.user?.firstName} {r.user?.lastName}
            </strong>
          </p>
          <p>
            {"⭐".repeat(r.rating)}
            {"☆".repeat(5 - r.rating)}
          </p>
          <p>{r.comment}</p>
          <p>
            <small>{new Date(r.createdAt).toLocaleDateString()}</small>
          </p>
        </div>
      ))}

      {user && (
        <div className="review-form">
          <h4>Yorum Yap</h4>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setNewReview({ ...newReview, rating: star })}
                style={{
                  color: newReview.rating >= star ? "#f9a825" : "#ccc",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            rows="3"
            placeholder="Make a comment..."
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
          ></textarea>
          <button disabled={submitting} onClick={handleSubmit}>
            Gönder
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
