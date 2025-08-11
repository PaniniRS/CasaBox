import React, { useState, useEffect } from "react";
import Header from "../../../components/layout/Header";
import BookingCard from "../../../components/booking/bookingCard";
import ActionLink from "../../../components/buttons/ActionLink";
import BookingRequestsModal from "../../../components/modals/BookingRequestsModal";
import EditListingModal from "../../../components/modals/EditListingModal"; // Import the new modal
import "./MyListingsPage.css";

const MyListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [editingListing, setEditingListing] = useState(null); // State for the edit modal

  const fetchMyListings = async () => {
    try {
      const response = await fetch("/listings/provider/mine", {
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setListings(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  return (
    <div className="my-listings-page">
      <Header />
      <main className="page-content">
        <h2>My Listings</h2>
        {loading ? (
          <p>Loading your listings...</p>
        ) : (
          <div className="listings-grid">
            {listings.map((listing) => (
              <div key={listing.ListingID} className="listing-item-container">
                <BookingCard listing={listing} />
                <div className="listing-actions">
                  {/* Open the edit modal on click */}
                  <ActionLink onClick={() => setEditingListing(listing)}>
                    Edit
                  </ActionLink>
                  <ActionLink onClick={() => setSelectedListing(listing)}>
                    Requests
                  </ActionLink>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      {selectedListing && (
        <BookingRequestsModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
      {/* Render the edit modal when a listing is being edited */}
      {editingListing && (
        <EditListingModal
          listing={editingListing}
          onClose={() => setEditingListing(null)}
          onSuccess={() => {
            setEditingListing(null);
            fetchMyListings(); // Refresh the listings after an update
          }}
        />
      )}
    </div>
  );
};

export default MyListingsPage;
