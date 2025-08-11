import React from "react";
import { useNavigate } from "react-router-dom";
import "./BookingCard.css";

const BookingCard = ({ listing }) => {
  // The prop is named listing, but can hold booking data
  const navigate = useNavigate();
  const imageUrl = listing.PrimaryImage
    ? `http://88.200.63.148:3080/${listing.PrimaryImage}`
    : "https://placehold.co/256x464/e2e8f0/333?text=No+Image";

  // Check if this is a booking object (has TotalCost) or a listing object
  const isBooking = listing.TotalCost !== undefined;

  const price = parseFloat(
    isBooking ? listing.TotalCost : listing.PricePerUnit
  );
  const priceUnit = isBooking
    ? `for ${new Date(listing.StartDate).toLocaleDateString()} - ${new Date(
        listing.EndDate
      ).toLocaleDateString()}`
    : listing.PriceUnit || "per item / day";

  const handleSeeBooking = () => {
    navigate(`/listing/${listing.ListingID}`);
  };

  return (
    <div
      className="booking-card"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="card-overlay-gradient" />

      <div className="card-details-container">
        <h3 className="card-place-name">{listing.Title}</h3>

        <div className="card-info-grid">
          {listing.StorageType === "ItemSlot" ? (
            <div className="info-item">
              <span className="info-label-small">Total Slots</span>
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

        <button className="see-booking-btn" onClick={handleSeeBooking}>
          SEE BOOKING
        </button>
      </div>
    </div>
  );
};

export default BookingCard;
