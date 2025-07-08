import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import CartPage from "../pages/CartPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import FavoritesPage from "../pages/FavoritesPage"; // ← EKLENDİ

function RouterConfig() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/favorites" element={<FavoritesPage />} /> {/* FAVORİLER */}
    </Routes>
  );
}

export default RouterConfig;
