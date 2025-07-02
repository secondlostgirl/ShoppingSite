import React, { useState } from 'react';
import '../css/Header.css';
import { SlBasket } from "react-icons/sl";
import { LuSun, LuMoon } from "react-icons/lu";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [theme, setTheme] = useState(false);
  const navigate = useNavigate();

  // 🔧 Sepetteki toplam ürün adedi
  const cartItemCount = useSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );

  const changeTheme = () => {
    setTheme(prev => !prev);
    document.body.classList.toggle("dark-mode");
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <header className='header'>
      <div className='logo-section' onClick={goHome} style={{ cursor: 'pointer' }}>
        <img className='logo' src="/images/logo.png" alt="Logo" />
        <p className='logo-text'>Shopping Spree</p>
      </div>

      <div className='search-section'>
        <input
          className='search-input'
          type='text'
          placeholder='Looking for something?'
        />
        <button className='search-button'>Search</button>

        <div className="cart-icon-wrapper" onClick={() => navigate('/cart')}>
          <SlBasket className='icon' />
          {cartItemCount > 0 && (
            <span className="cart-count">{cartItemCount}</span>
          )}
        </div>

        {!theme ? (
          <LuMoon className='icon' onClick={changeTheme} />
        ) : (
          <LuSun className='icon' onClick={changeTheme} />
        )}
      </div>
    </header>
  );
}

export default Header;
