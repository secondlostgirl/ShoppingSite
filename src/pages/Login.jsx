import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/Login.css";
import { useDispatch } from "react-redux"; // ✅ redux'tan dispatch import edildi
import { loadCartFromDB } from "../redux/slices/cartSlice"; // ✅ sepeti yükleyecek thunk

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ✅ burada tanımlandı

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login yanıtı:", data);

      if (res.ok && data.user && data.user._id) {
        localStorage.setItem("user", JSON.stringify({ userId: data.user._id }));

        dispatch(loadCartFromDB(data.user._id)); // ✅ sepeti Redux + localStorage'a yükler
        navigate("/home"); // ✅ giriş başarılıysa yönlendir
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("İstek hatası:", error);
      alert("Sunucuyla bağlantı kurulamadı.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>

        <p style={{ fontSize: "0.9rem", marginTop: "1rem" }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
