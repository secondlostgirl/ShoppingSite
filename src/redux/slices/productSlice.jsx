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
  return response.data;
});

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
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

        // 🔄 Ürünleri unique olarak set et (aynı ID'yi tekrar ekleme)
        const updatedProducts = action.payload.map((product, index) => ({
          ...product,
          title: customTitles[index] || product.title,
        }));

        const uniqueProducts = updatedProducts.filter(
          (newProduct) => !state.products.some((p) => p._id === newProduct._id)
        );

        state.products = [...state.products, ...uniqueProducts];
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        console.error("Ürünler yüklenemedi:", action.error.message);
      });
  },
});

export default productSlice.reducer;
