import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import "./BookingView.css";

// ===============================================================
//                      Helper Components
// ===============================================================
const Counter = ({ value, onIncrement, onDecrement }) => (
  <div className="counter">
    <button onClick={onDecrement}>-</button>
    <span>{value}</span>
    <button onClick={onIncrement}>+</button>
  </div>
);

const BookingSuccessPopup = ({ onAnimationEnd }) => (
  <div className="popup-overlay" onAnimationEnd={onAnimationEnd}>
    <div className="popup-content">
      <svg
        className="popup-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <h3>Booking Successful!</h3>
      <p>Redirecting to the home page...</p>
    </div>
  </div>
);

const BookingView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  // Booking State
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [itemCounts, setItemCounts] = useState({ S: 0, M: 0, L: 0 });
  const [sqm, setSqm] = useState(1);
  const [totalCost, setTotalCost] = useState(0);
  const [bookingStep, setBookingStep] = useState("initial");

  // --- NEW: useEffect for Keyboard Navigation ---
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!listing || listing.Images.length <= 1) return;

      if (event.key === "ArrowRight") {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % listing.Images.length
        );
      } else if (event.key === "ArrowLeft") {
        setCurrentImageIndex(
          (prevIndex) =>
            (prevIndex - 1 + listing.Images.length) % listing.Images.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [listing]); // Dependency array ensures the listener always has the latest listing data

  useEffect(() => {
    const checkSessionAndFetchListing = async () => {
      try {
        const sessionResponse = await fetch("/auth/session", {
          credentials: "include",
        });
        const sessionResult = await sessionResponse.json();
        if (!sessionResult.success) {
          navigate("/login");
          return;
        }

        const listingResponse = await fetch(`/listings/${id}`);
        const listingResult = await listingResponse.json();
        if (listingResult.success) {
          setListing(listingResult.data);
        } else {
          throw new Error(listingResult.message);
        }
      } catch (err) {
        setError("Failed to load listing details.");
      } finally {
        setLoading(false);
      }
    };
    checkSessionAndFetchListing();
  }, [id, navigate]);

  useEffect(() => {
    if (!listing || !startDate || !endDate || startDate > endDate) {
      setTotalCost(0);
      return;
    }
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;
    let cost = 0;
    if (listing.StorageType === "ItemSlot") {
      const totalItems = itemCounts.S + itemCounts.M + itemCounts.L;
      cost = totalItems * listing.PricePerUnit * diffDays;
    } else {
      cost = sqm * listing.PricePerUnit * diffDays;
    }
    setTotalCost(cost);
  }, [listing, startDate, endDate, itemCounts, sqm]);

  const handleBooking = async () => {
    setError("");
    if (bookingStep === "initial") {
      if (!startDate || !endDate)
        return setError("Please select a start and end date.");
      if (startDate > endDate)
        return setError("End date must be after the start date.");
      if (
        listing.StorageType === "ItemSlot" &&
        itemCounts.S + itemCounts.M + itemCounts.L === 0
      ) {
        return setError("Please select the number of items.");
      }
      setBookingStep("confirming");
      return;
    }
    if (bookingStep === "confirming") {
      const bookingData = {
        listingId: parseInt(id, 10),
        startDate,
        endDate,
        totalCost,
        storageType: listing.StorageType,
        items: [
          { categoryId: 1, quantity: itemCounts.S },
          { categoryId: 2, quantity: itemCounts.M },
          { categoryId: 3, quantity: itemCounts.L },
        ].filter((item) => item.quantity > 0),
        requestedSqm: sqm,
      };
      try {
        const response = await fetch("/listings/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(bookingData),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Booking failed.");
        setBookingStep("booked");
      } catch (err) {
        setError(err.message);
        setBookingStep("initial");
      }
    }
  };

  const currentImage =
    listing?.Images[currentImageIndex]?.FileURL ||
    "https://placehold.co/1200x800";
  const price = parseFloat(listing?.PricePerUnit);

  return (
    <div
      className="booking-view-page"
      style={{
        backgroundImage: `url(${
          listing ? `http://88.200.63.148:3080/${currentImage}` : ""
        })`,
      }}
    >
      {bookingStep === "booked" && (
        <BookingSuccessPopup
          onAnimationEnd={() => setTimeout(() => navigate("/home"), 1500)}
        />
      )}

      <button className="close-page-btn" onClick={() => navigate("/home")}>
        &times;
      </button>

      <div className="page-content-wrapper">
        {loading ? (
          <div className="status-message">Loading...</div>
        ) : error && !listing ? (
          <div className="status-message">{error}</div>
        ) : listing ? (
          <>
            <div className="info-panel">
              <div className="image-dots">
                {listing.Images.map((img, index) => (
                  <span
                    key={index}
                    className={`dot ${
                      index === currentImageIndex ? "active" : ""
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  ></span>
                ))}
              </div>
              <h1 className="place-title">{listing.Title}</h1>
              <div className="details-row">
                <div className="capacity-info">
                  {listing.StorageType === "ItemSlot" ? (
                    <div className="info-item">
                      <span>SLOTS</span>
                      <span>{listing.TotalCapacity_Slots}</span>
                    </div>
                  ) : (
                    <div className="info-item">
                      <span>SQM</span>
                      <span>{listing.CapacitySQMeter}</span>
                    </div>
                  )}
                </div>
                <div className="price-info">
                  <span className="price-amount">
                    ${!isNaN(price) ? price.toFixed(2) : "0.00"}
                  </span>
                  <span className="price-unit">{listing.PriceUnit}</span>
                </div>
              </div>
              <button
                className={`book-now-btn ${
                  bookingStep === "confirming" ? "confirming" : ""
                }`}
                onClick={handleBooking}
              >
                {bookingStep === "confirming" ? "Confirm?" : "Book now"}
              </button>
              {error && <p className="booking-error-message">{error}</p>}
            </div>

            <div className={`booking-panel ${isPanelOpen ? "open" : ""}`}>
              <button
                className="panel-toggle"
                onClick={() => setIsPanelOpen(!isPanelOpen)}
              >
                {isPanelOpen ? "→" : "←"}
              </button>
              <div className="panel-content">
                <section>
                  <h2>Availability</h2>
                  <div className="date-picker-group">
                    <label>From:</label>
                    <ReactDatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      placeholderText="Select Date"
                    />
                  </div>
                  <div className="date-picker-group">
                    <label>To:</label>
                    <ReactDatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      placeholderText="Select Date"
                    />
                  </div>
                </section>
                <section>
                  <h2>
                    {listing.StorageType === "ItemSlot"
                      ? "Luggage Size"
                      : "Space Size"}
                  </h2>
                  {listing.StorageType === "ItemSlot" ? (
                    <div className="item-counters">
                      <div className="item-type">
                        <span>S</span>
                        <Counter
                          value={itemCounts.S}
                          onIncrement={() =>
                            setItemCounts((p) => ({ ...p, S: p.S + 1 }))
                          }
                          onDecrement={() =>
                            setItemCounts((p) => ({
                              ...p,
                              S: Math.max(0, p.S - 1),
                            }))
                          }
                        />
                      </div>
                      <div className="item-type">
                        <span>M</span>
                        <Counter
                          value={itemCounts.M}
                          onIncrement={() =>
                            setItemCounts((p) => ({ ...p, M: p.M + 1 }))
                          }
                          onDecrement={() =>
                            setItemCounts((p) => ({
                              ...p,
                              M: Math.max(0, p.M - 1),
                            }))
                          }
                        />
                      </div>
                      <div className="item-type">
                        <span>L</span>
                        <Counter
                          value={itemCounts.L}
                          onIncrement={() =>
                            setItemCounts((p) => ({ ...p, L: p.L + 1 }))
                          }
                          onDecrement={() =>
                            setItemCounts((p) => ({
                              ...p,
                              L: Math.max(0, p.L - 1),
                            }))
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="sqm-counter">
                      <Counter
                        value={sqm}
                        onIncrement={() => setSqm((p) => p + 1)}
                        onDecrement={() => setSqm((p) => Math.max(1, p - 1))}
                      />
                    </div>
                  )}
                </section>
                <section>
                  <h2>Summary</h2>
                  <div className="summary-details">
                    {listing.StorageType === "ItemSlot" ? (
                      <p>
                        <strong>Total Luggage:</strong> S: {itemCounts.S}, M:{" "}
                        {itemCounts.M}, L: {itemCounts.L}
                      </p>
                    ) : (
                      <p>
                        <strong>Total Space:</strong> {sqm} SQM
                      </p>
                    )}
                    <p>
                      <strong>Date:</strong> {startDate?.toLocaleDateString()}{" "}
                      to {endDate?.toLocaleDateString()}
                    </p>
                    <p className="summary-cost">
                      <strong>Cost:</strong> ${totalCost.toFixed(2)}
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default BookingView;
