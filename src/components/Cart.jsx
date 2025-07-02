// components/Cart.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, increaseQuantity, decreaseQuantity, clearCart } from '../redux/slices/cartSlice';
import '../css/Cart.css';

function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(state => state.cart.items);

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  if (items.length === 0) {
    return <div className="cart-empty">Sepetiniz boş 🛒</div>;
  }

  return (
    <div className="cart-container">
      <h2>Sepetiniz</h2>
      {items.map(item => (
        <div key={item.id} className="cart-item">
          <img src={item.image} alt={item.title} />
          <div className="info">
            <h3>{item.title}</h3>
            <p>Fiyat: ${item.price}</p>
            <p>Miktar: {item.quantity}</p>
            <div className="actions">
              <button onClick={() => dispatch(decreaseQuantity(item.id))}>-</button>
              <button onClick={() => dispatch(increaseQuantity(item.id))}>+</button>
              <button onClick={() => dispatch(removeFromCart(item.id))}>Sil</button>
            </div>
          </div>
        </div>
      ))}

      <div className="cart-summary">
        <strong>Toplam: ${totalPrice}</strong>
        <button onClick={() => dispatch(clearCart())}>Sepeti Temizle</button>
      </div>
    </div>
  );
}

export default Cart;
