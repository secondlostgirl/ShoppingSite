import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../redux/slices/cartSlice";
import "../css/CartPage.css";

function CartPage() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce((sum, item) => {
    if (item.price && item.quantity) {
      return sum + item.price * item.quantity;
    }
    return sum;
  }, 0);

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty 🛒</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item._id || item.id} className="cart-item">
                <img
                  src={
                    Array.isArray(item.image)
                      ? `/images/${item.image[0]}`
                      : `/images/${item.image}`
                  }
                  alt={item.title}
                />
                <div>
                  <h3>{item.title}</h3>
                  <p>
                    {item.price !== undefined
                      ? `$${item.price.toFixed(2)} x ${item.quantity}`
                      : "Fiyat bulunamadı"}
                  </p>
                  <div className="quantity-controls">
                    <button
                      onClick={() =>
                        dispatch(decreaseQuantity(item._id || item.id))
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        dispatch(increaseQuantity(item._id || item.id))
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() =>
                      dispatch(removeFromCart(item._id || item.id))
                    }
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <button className="clear-btn" onClick={() => dispatch(clearCart())}>
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
