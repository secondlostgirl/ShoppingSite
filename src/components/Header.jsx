import React, { useState } from "react";
import "../css/Header.css";
import { SlBasket } from "react-icons/sl";
import { LuSun, LuMoon } from "react-icons/lu";
import { FaHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { resetCartOnLogout } from "../redux/slices/cartSlice";

function Header() {
  const [theme, setTheme] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // 🔧 eksik olan state

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItemCount = useSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );

  const changeTheme = () => {
    setTheme((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  };

  const goHome = () => {
    navigate("/home");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(resetCartOnLogout());
    navigate("/");
  };

  return (
    <header className="header">
      <div
        className="logo-section"
        onClick={goHome}
        style={{ cursor: "pointer" }}
      >
        <img className="logo" src="/images/logo.png" alt="Logo" />
        <p className="logo-text">Shopping Spree</p>
      </div>

      <div className="search-section">
        <input
          className="search-input"
          type="text"
          placeholder="Looking for something?"
        />
        <button className="search-button">Search</button>

        <div className="cart-icon-wrapper" onClick={() => navigate("/cart")}>
          <SlBasket className="icon" />
          {cartItemCount > 0 && (
            <span className="cart-count">{cartItemCount}</span>
          )}
        </div>

        {!theme ? (
          <LuMoon className="icon" onClick={changeTheme} />
        ) : (
          <LuSun className="icon" onClick={changeTheme} />
        )}

        <div
          className="favorite-icon-wrapper"
          onClick={() => navigate("/favorites")}
        >
          <FaHeart className="icon" />
        </div>

        {/* 👤 My Profile dropdown */}
        <div
          className="profile-menu"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <span className="profile-btn">👤 My Profile</span>
          {showDropdown && (
            <div className="profile-dropdown">
              <Link to="/profile">Profile Information</Link>
              <Link to="/addresses">My reviews</Link>
              <Link to="/orders">My Orders</Link>
            </div>
          )}
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
