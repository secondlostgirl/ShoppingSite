import React, { useEffect, useState } from "react";
import "../css/MyReviews.css";
import { Link } from "react-router-dom";

function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?.userId) return;

    fetch(`http://localhost:5000/api/reviews/user/${user.userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched reviews:", data);
        setReviews(data);
      })
      .catch((err) => console.error("Review fetch error:", err));
  }, [user?.userId]);

  console.log(reviews);

  return (
    <div className="my-reviews-container">
      <h2>⭐ My Reviews</h2>

      {reviews.length === 0 ? (
        <p>You haven't written any reviews yet.</p>
      ) : (
        reviews.map((r, i) => (
          <div key={i} className="review-item">
            <Link
              to={`/product/${r.product?._id}`}
              className="review-product-link"
            >
              <img
                src={`/images/${
                  Array.isArray(r.product?.image)
                    ? r.product.image[0]
                    : r.product?.image
                }`}
                alt={r.product?.title || "Product image"}
                className="review-product-image"
              />
              <div className="review-details">
                <h4>{r.product?.title}</h4>
                <p>
                  {"⭐".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </p>
                <p>{r.comment}</p>
                <small>{new Date(r.createdAt).toLocaleDateString()}</small>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

export default MyReviews;
