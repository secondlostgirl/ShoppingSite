import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import ProductDetails from '../pages/ProductDetails';
import CartPage from '../pages/CartPage';
import Login from '../pages/Login'; // ← Login sayfasını import ettik
import Register from '../pages/Register';


function RouterConfig() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
     
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<Login />} /> {/* ← Login route'u eklendi */}
    </Routes>
  );
}

export default RouterConfig;
