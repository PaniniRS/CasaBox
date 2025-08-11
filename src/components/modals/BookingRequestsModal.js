import React, { useState, useEffect } from "react";
import "./BookingRequestsModal.css";

const BookingRequestsModal = ({ listing, onClose }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`/listings/${listing.ListingID}/requests`, {
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setRequests(result.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [listing.ListingID]);

  const handleStatusUpdate = async (bookingId, status) => {
    await fetch(`/listings/bookings/${bookingId}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    fetchRequests(); // Refresh the list
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content requests-modal">
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>
        <h3>Booking Requests for {listing.Title}</h3>
        <div className="requests-list">
          {loading ? (
            <p>Loading...</p>
          ) : (
            requests.map((req) => (
              <div key={req.BookingID} className="request-item">
                <div className="request-info">
                  <strong>{req.SeekerName}</strong>
                  <span>
                    {new Date(req.StartDate).toLocaleDateString()} -{" "}
                    {new Date(req.EndDate).toLocaleDateString()}
                  </span>
                  {/* You can add logic here to show items/sqm */}
                </div>
                <div className="request-actions">
                  <button
                    className="accept-btn"
                    onClick={() =>
                      handleStatusUpdate(req.BookingID, "Confirmed")
                    }
                  >
                    Accept
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() =>
                      handleStatusUpdate(req.BookingID, "Rejected")
                    }
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
          {!loading && requests.length === 0 && <p>No pending requests.</p>}
        </div>
      </div>
    </div>
  );
};

export default BookingRequestsModal;
