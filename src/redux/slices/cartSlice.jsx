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
    addToCart: (state, action) => {
      const { _id, selectedSize } = action.payload;

      const existingItem = state.items.find(
        (item) => item._id === _id && item.selectedSize === selectedSize
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    removeFromCart(state, action) {
      const { id, selectedSize } = action.payload;

      console.log(action.payload);
      state.items = state.items.filter(
        (item) => !(item._id === id && item.selectedSize === selectedSize)
      );
      localStorage.setItem("cartItems", JSON.stringify(state.items));

      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?.userId) {
        fetch("http://localhost:5000/api/cart/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: storedUser.userId,
            productId: id,
            selectedSize: selectedSize || "standard",
          }),
        });
      }
    },

    increaseQuantity(state, action) {
      const { id, selectedSize } = action.payload;
      const item = state.items.find(
        (i) => i._id === id && i.selectedSize === selectedSize
      );
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
              selectedSize: item.selectedSize,
              quantity: item.quantity,
            }),
          });
        }
      }
    },

    decreaseQuantity(state, action) {
      const { id, selectedSize } = action.payload;
      const item = state.items.find(
        (i) => i._id === id && i.selectedSize === selectedSize
      );
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
              selectedSize: item.selectedSize,
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

    setCartFromDatabase(state, action) {
      const items = action.payload.map((item) => ({
        _id: item.productId._id,
        title: item.productId.title,
        price: item.productId.price,
        image: item.productId.image,
        quantity: item.quantity,
        selectedSize: item.selectedSize || "standard",
      }));
      state.items = items;
      localStorage.setItem("cartItems", JSON.stringify(items));
    },
  },

  extraReducers: (builder) => {
    builder.addCase(loadCartFromDB.fulfilled, (state, action) => {
      const normalizedItems = action.payload.map((item) => ({
        _id: item.productId._id,
        title: item.productId.title,
        price: item.productId.price,
        image: item.productId.image,
        quantity: item.quantity,
        selectedSize: item.selectedSize || "standard",
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
  setCartFromDatabase,
} = cartSlice.actions;

export default cartSlice.reducer;
