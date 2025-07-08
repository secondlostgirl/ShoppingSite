import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Product from "../components/Product";

function FavoritesPage() {
  const { products } = useSelector((store) => store.product);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.userId;

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:5000/api/favorites/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const favIds = data.map((f) => f.productId);
        setFavorites(favIds);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <p>Loading...</p>;

  const favProducts = products.filter((product) =>
    favorites.includes(product._id)
  );

  return (
    <div>
      <h2>Your Favorites 💖</h2>
      <div className="product-list">
        {favProducts.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default FavoritesPage;
