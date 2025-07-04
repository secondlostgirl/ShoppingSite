import React, { useState, useEffect } from "react";
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

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success("Product successfully added to cart 🛍️");
  };

  useEffect(() => {
    if (product?.image.length > 0) {
      setSelectedImage(product?.image[0]);
    }
  }, [product?.image]);

  return (
    <div className="details-container">
      <div className="image-section">
        <img
          src={`/public/images/${selectedImage}`}
          alt={product?.title}
          className="main-image"
        />
        <div className="thumbnail-container">
          {Array.isArray(product?.image) &&
            product.image.map((img, idx) => (
              <img
                key={idx}
                src={`/public/images/${img}`}
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
