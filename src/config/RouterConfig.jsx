import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import ProductDetails from '../pages/ProductDetails'; // ekle
import CartPage from '../pages/CartPage';
import Cart from "../components/Cart";

function RouterConfig() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route path="/product/:id" element={<ProductDetails />} /> {/* detay rotası */}
      <Route path="/cart" element={<CartPage />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
    
  );
}

export default RouterConfig;
