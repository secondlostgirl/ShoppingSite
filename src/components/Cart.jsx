// components/Cart.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  setCartFromDatabase,
} from "../redux/slices/cartSlice";
import axios from "axios";
import "../css/Cart.css";

function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user); // kullanıcı bilgisi redux'ta saklanıyor varsayımı

  const totalPrice = items
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  useEffect(() => {
    if (user?._id) {
      axios
        .get(`/api/cart/${user._id}`)
        .then((res) => {
          if (res.data && res.data.items) {
            dispatch(setCartFromDatabase(res.data.items));
          }
        })
        .catch((err) => console.error("Sepet verisi çekilemedi:", err));
    }
  }, [user]);

  if (items.length === 0) {
    return <div className="cart-empty">Sepetiniz boş 🛒</div>;
  }

  return (
    <div className="cart-container">
      <h2>Sepetiniz</h2>
      {items.map((item) => (
        <div key={item.id || item._id} className="cart-item">
          <img
            src={
              Array.isArray(item.image)
                ? `/images/${item.image[0]}`
                : item.image
            }
            alt={item.title}
          />
          <div className="info">
            <h3>{item.title}</h3>
            <p>Fiyat: ${item.price}</p>
            <p>Miktar: {item.quantity}</p>
            <div className="actions">
              <button onClick={() => dispatch(decreaseQuantity(item._id))}>
                -
              </button>
              <button onClick={() => dispatch(increaseQuantity(item._id))}>
                +
              </button>
              <button onClick={() => dispatch(removeFromCart(item._id))}>
                Sil
              </button>
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
