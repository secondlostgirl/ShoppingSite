import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.userId) {
      fetch(`http://localhost:5000/api/favorites/${user.userId}`)
        .then((res) => res.json())
        .then((data) => setFavorites(data));
    }
  }, []);

  return (
    <div className="favorites-page">
      <h2>Your Favorites</h2>
      {favorites.length === 0 ? (
        <p>No favorites yet ❤️</p>
      ) : (
        <ul>
          {favorites.map((fav) => (
            <li key={fav._id}>{fav.productId.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Favorites;
