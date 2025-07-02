import React from 'react';
import '../css/Product.css';
import { useNavigate } from 'react-router-dom';

function Product({ product }) {
  const { id, image, title, description, price } = product;
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    navigate(`/product/${id}`); // detay sayfasına yönlendir
  };

  return (
    <div className="product-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <strong>${price}</strong>

      <button className="details-btn" onClick={handleDetailsClick}>
        Details
      </button>
    </div>
  );
}

export default Product;
