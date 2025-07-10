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
import { Link } from "react-router-dom";
import "../css/Cart.css";

function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);

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
        <div
          key={`${item._id}-${item.selectedSize || "standard"}`}
          className="cart-item"
        >
          <Link to={`/product/${item._id}`} className="cart-link">
            <img
              src={
                Array.isArray(item.image)
                  ? `/images/${item.image[0]}`
                  : item.image
              }
              alt={item.title}
              className="cart-image"
            />
          </Link>

          <div className="info">
            <Link to={`/product/${item._id}`} className="cart-title-link">
              <h3>{item.title}</h3>
            </Link>

            {item.selectedSize && (
              <p>
                <strong>Beden:</strong> {item.selectedSize}
              </p>
            )}
            <p>Fiyat: ${item.price}</p>
            <p>Miktar: {item.quantity}</p>
            <div className="actions">
              <button
                onClick={() =>
                  dispatch(
                    decreaseQuantity({
                      id: item._id,
                      selectedSize: item.selectedSize,
                    })
                  )
                }
              >
                -
              </button>
              <button
                onClick={() =>
                  dispatch(
                    increaseQuantity({
                      id: item._id,
                      selectedSize: item.selectedSize,
                    })
                  )
                }
              >
                +
              </button>
              <button
                onClick={() =>
                  dispatch(
                    removeFromCart({
                      id: item._id,
                      selectedSize: item.selectedSize,
                    })
                  )
                }
              >
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
