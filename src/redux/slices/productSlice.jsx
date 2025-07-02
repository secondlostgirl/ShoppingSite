import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  products: [],
  selectedProduct: {},
  loading: false
};

const BASE_URL = "https://fakestoreapi.com";

export const getAllProducts = createAsyncThunk("getAllProducts", async () => {
  const response = await axios.get(`${BASE_URL}/products`);
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

      // ✅ BURAYA EKLİYORSUN
      const customImages = [
        "/images/product1.jpg",
        "/images/product2.jpg",
        "/images/product3.jpg",
        "/images/product4.jpg",
        "/images/product5.jpg",
        "/images/product6.jpg",
        "/images/product7.jpg",
        "/images/product8.jpg",
        "/images/product9.jpg",
        "/images/product10.jpg",
        "/images/product11.jpg",
        "/images/product12.jpg",
        "/images/product13.jpg",
        "/images/product14.jpg",
        "/images/product15.jpg",
        "/images/product16.jpg",
        "/images/product17.jpg",
        "/images/product18.jpg",
        "/images/product19.jpg",
        "/images/product20.jpg",
        
      ];
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
  "Butterfly Sunglasses"
];

state.products = action.payload.map((product, index) => ({
  ...product,
  image: customImages[index] || product.image,
  title: customTitles[index] || product.title
}));

    });
  }
});

export const {} = productSlice.actions;
export default productSlice.reducer;
