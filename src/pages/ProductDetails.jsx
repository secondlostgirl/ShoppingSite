import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import '../css/ProductDetails.css';
import { toast } from 'react-toastify';

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.product);
  const product = products.find((item) => item.id === parseInt(id));

  if (!product) return <p style={{ padding: '20px' }}>Product not found.</p>;

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success("Product successfully added to cart 🛍️");
  };

  return (
    <div className="details-container">
      <div className="image-section">
        <img src={product.image} alt={product.title} />
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
