import React from "react";
import "./StarRating.css";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="star-rating">
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="star full-star">
          ★
        </span>
      ))}
      {halfStar && <span className="star half-star">★</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="star empty-star">
          ★
        </span>
      ))}
      <span className="rating-text">
        {rating ? rating.toFixed(1) : "N/A"}/5
      </span>
    </div>
  );
};

export default StarRating;
