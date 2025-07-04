import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  products: [],
  selectedProduct: {},
  loading: false,
};

const BASE_URL = "http://localhost:5000";

export const getAllProducts = createAsyncThunk("getAllProducts", async () => {
  const response = await axios.get(`${BASE_URL}/api/products`);
  console.log(response);
  return response.data;
});

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllProducts.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getAllProducts.fulfilled, (state, action) => {
      state.loading = false;

      const customTitles = [
        "Pink Bow Bag",
        "Butterfly Heels",
        "Lace Pink Dress",
        "Heart-Shaped Sunglasses",
        "Romantic Tulle Dress",
        "Heart Earrings",
        "Gemstone Ring Set",
        "Strawberry Necklace",
        "Kawaii Pink Dress",
        "Pink Blue Dress",
        "Heart Shaped Sunglasses",
        "Heart Gold Ring",
        "Pearl Necklace With Heart Gem",
        "Butterfly Earrings",
        "Pink Bag",
        "Lolita Bag",
        "Pink Converse",
        "Strawberry Dress",
        "Pink Lingerie",
        "Butterfly Sunglasses",
      ];

      state.products = action.payload.map((product, index) => ({
        ...product,
        title: customTitles[index] || product.title,
      }));
    });
  },
});

export default productSlice.reducer;
