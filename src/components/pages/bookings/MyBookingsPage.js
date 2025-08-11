import React, { useState, useEffect } from "react";
import Header from "../../layout/Header";
import BookingCard from "../../booking/bookingCard";
import ActionLink from "../../buttons/ActionLink";
import "./MyBookingsPage.css";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const response = await fetch("/listings/seeker/mine", {
          credentials: "include",
        });
        const result = await response.json();
        if (result.success) {
          setBookings(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, []);

  return (
    <div className="my-bookings-page">
      <Header />
      <main className="page-content">
        <h2>My Bookings</h2>
        {loading ? (
          <p>Loading your bookings...</p>
        ) : (
          <div className="listings-grid">
            {bookings.map((booking) => (
              <div key={booking.BookingID} className="listing-item-container">
                <BookingCard listing={booking} />
                <div className="listing-actions">
                  <ActionLink variant="secondary">
                    Status: {booking.BookingStatus}
                  </ActionLink>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBookingsPage;
