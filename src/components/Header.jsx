import React, { useState } from 'react';
import '../css/Header.css';
import { SlBasket } from "react-icons/sl";
import { LuSun, LuMoon } from "react-icons/lu";

function Header() {
  const [theme, setTheme] = useState(false); // false = light, true = dark

  const changeTheme = () => {
    setTheme(prev => !prev);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <header className='header'>
      <div className='logo-section'>
        <img className='logo' src="./src/images/logo.png" alt="Logo" />
        <p className='logo-text'>Shopping Spree</p>
      </div>

      <div className='search-section'>
        <input
          className='search-input'
          type='text'
          placeholder='Looking for something?'
        />
        <button className='search-button'>Search</button>
        <SlBasket className='icon' />
        
        {/* Dark mode: show sun, Light mode: show moon */}
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
