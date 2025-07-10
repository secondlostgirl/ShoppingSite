import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProductDetails from "../pages/ProductDetails";
import CartPage from "../pages/CartPage";
import FavoritesPage from "../pages/FavoritesPage";
import ProfileInfo from "../pages/ProfileInfo";
import Orders from "../pages/Orders";
import MyReviews from "../pages/MyReviews";

function RouterConfig() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/profile" element={<ProfileInfo />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/my-reviews" element={<MyReviews />} />
    </Routes>
  );
}

export default RouterConfig;
