import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../redux/slices/productSlice';
import appReducer from '../redux/slices/appSlice';
import cartReducer from './slices/cartSlice';
import basketReducer from './slices/basketSlice';
export const store = configureStore({
  reducer: {
    app:appReducer,
    product:productReducer,
    cart: cartReducer,
    basket:basketReducer
    
  },
})

