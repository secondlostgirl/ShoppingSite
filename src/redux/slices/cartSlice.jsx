import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 🎯 Async thunk: Kullanıcının sepetini veritabanından çek
export const loadCartFromDB = createAsyncThunk(
  "cart/loadCartFromDB",
  async (userId) => {
    const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
    const data = await res.json();
    return data.items || [];
  }
);

const initialState = {
  items: JSON.parse(localStorage.getItem("cartItems")) || [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    removeFromCart(state, action) {
      const id = action.payload;
      state.items = state.items.filter((item) => item._id !== id);
      localStorage.setItem("cartItems", JSON.stringify(state.items));

      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?.userId) {
        fetch("http://localhost:5000/api/cart/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: storedUser.userId,
            productId: id,
          }),
        });
      }
    },

    increaseQuantity(state, action) {
      const item = state.items.find((i) => i._id === action.payload);
      if (item) {
        item.quantity++;
        localStorage.setItem("cartItems", JSON.stringify(state.items));

        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser?.userId) {
          fetch("http://localhost:5000/api/cart/update", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: storedUser.userId,
              productId: item._id,
              quantity: item.quantity,
            }),
          });
        }
      }
    },

    decreaseQuantity(state, action) {
      const item = state.items.find((i) => i._id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity--;
        localStorage.setItem("cartItems", JSON.stringify(state.items));

        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser?.userId) {
          fetch("http://localhost:5000/api/cart/update", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: storedUser.userId,
              productId: item._id,
              quantity: item.quantity,
            }),
          });
        }
      }
    },
    clearCart(state) {
      state.items = [];
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    resetCartOnLogout(state) {
      state.items = [];
      localStorage.removeItem("cartItems");
    },
  },
  removeFromCart(state, action) {
    const id = action.payload;
    state.items = state.items.filter((item) => item._id !== id);
    localStorage.setItem("cartItems", JSON.stringify(state.items));

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.userId) {
      fetch("http://localhost:5000/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: storedUser.userId,
          productId: id,
        }),
      });
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loadCartFromDB.fulfilled, (state, action) => {
      const normalizedItems = action.payload.map((item) => ({
        _id: item.productId._id,
        title: item.productId.title,
        price: item.productId.price,
        image: item.productId.image,
        quantity: item.quantity,
      }));

      state.items = normalizedItems;
      localStorage.setItem("cartItems", JSON.stringify(normalizedItems));
    });
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  resetCartOnLogout,
} = cartSlice.actions;

export default cartSlice.reducer;
