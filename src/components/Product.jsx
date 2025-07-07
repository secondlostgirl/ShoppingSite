import React from "react";
import "../css/Product.css";
import { useNavigate } from "react-router-dom";
function Product({ product }) {
  const { _id, image, title, description, price } = product;
  console.log(image);
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    navigate(`/product/${_id}`);
  };

  return (
    <div className="product-card">
      <img src={`/images/${image[0]}`} alt={title} />
      <h3>{title}</h3>
      <strong>${price}</strong>
      <button className="details-btn" onClick={handleDetailsClick}>
        Details
      </button>
    </div>
  );
}

export default Product;
