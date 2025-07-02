// redux/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

// 🧠 localStorage'tan veriyi çek
const storedItems = JSON.parse(localStorage.getItem("cartItems")) || [];

const initialState = {
  items: storedItems
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      localStorage.setItem("cartItems", JSON.stringify(state.items)); // 💾
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    increaseQuantity(state, action) {
      const item = state.items.find(i => i.id === action.payload);
      if (item) item.quantity++;
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    decreaseQuantity(state, action) {
      const item = state.items.find(i => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity--;
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    clearCart(state) {
      state.items = [];
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
