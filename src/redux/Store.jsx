import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../redux/slices/productSlice';
import appReducer from '../redux/slices/appSlice';
import cartReducer from './slices/cartSlice';
export const store = configureStore({
  reducer: {
    app:appReducer,
    product:productReducer,
    cart: cartReducer
    
  },
})

