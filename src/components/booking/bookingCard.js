import React from "react";
import "./BookingCard.css";
import { useNavigate } from "react-router-dom";

const BookingCard = ({ listing }) => {
  const navigate = useNavigate();
  const imageUrl = listing.PrimaryImage
    ? `http://88.200.63.148:3080/${listing.PrimaryImage}`
    : "https://placehold.co/256x464/e2e8f0/333?text=No+Image";

  const price = parseFloat(listing.PricePerUnit);
  const priceUnit = listing.PriceUnit || "undfined";
  const handleSeeBooking = () => {
    navigate(`/listing/${listing.ListingID}`);
  };

  return (
    <div
      className="new-booking-card"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="card-overlay-gradient-bc" />

      <div className="card-details-container-bc">
        <h3 className="card-place-name">{listing.Title}</h3>

        <div className="card-info-grid-bc">
          {/* CORRECTED: This logic now correctly displays the capacity */}
          {listing.StorageType === "ItemSlot" ? (
            <div className="info-item-bc">
              <span className="info-label-small-bc">SLOTS</span>
              <span className="info-value-bc">
                {listing.TotalCapacity_Slots || 0}
              </span>
            </div>
          ) : (
            <div className="info-item-bc">
              <span className="info-label-small-bc">SQM</span>
              <span className="info-value-bc">
                {listing.CapacitySQMeter || 0}
              </span>
            </div>
          )}
        </div>

        <div className="card-price-container-bc">
          <span className="price-amoun-bc">
            ${!isNaN(price) ? price.toFixed(2) : "0.00"}
          </span>
          <span className="price-unit-bc">{priceUnit}</span>
        </div>

        <button className="see-booking-btn-bc" onClick={handleSeeBooking}>
          SEE BOOKING
        </button>
      </div>
    </div>
  );
};

export default BookingCard;
