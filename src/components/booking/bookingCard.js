import React from "react";
import "./BookingCard.css";

const BookingCard = ({ listing }) => {
  const imageUrl = listing.PrimaryImage
    ? `http://88.200.63.148:3080/${listing.PrimaryImage}`
    : "https://placehold.co/256x464/e2e8f0/333?text=No+Image";

  const price = parseFloat(listing.PricePerUnit);
  const priceUnit = listing.PriceUnit || "undfined";

  return (
    <div
      className="new-booking-card"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="card-overlay-gradient" />

      <div className="card-details-container">
        <h3 className="card-place-name">{listing.Title}</h3>

        <div className="card-info-grid">
          {/* CORRECTED: This logic now correctly displays the capacity */}
          {listing.StorageType === "ItemSlot" ? (
            <div className="info-item">
              <span className="info-label-small">SLOTS</span>
              <span className="info-value">
                {listing.TotalCapacity_Slots || 0}
              </span>
            </div>
          ) : (
            <div className="info-item">
              <span className="info-label-small">SQM</span>
              <span className="info-value">{listing.CapacitySQMeter || 0}</span>
            </div>
          )}
        </div>

        <div className="card-price-container">
          <span className="price-amount">
            ${!isNaN(price) ? price.toFixed(2) : "0.00"}
          </span>
          <span className="price-unit">{priceUnit}</span>
        </div>

        <button className="see-booking-btn">SEE BOOKING</button>
      </div>
    </div>
  );
};

export default BookingCard;
