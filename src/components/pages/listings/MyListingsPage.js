import React, { useState, useEffect } from "react";
import Header from "../../layout/Header";
import BookingCard from "../../booking/bookingCard";
import ActionLink from "../../buttons/ActionLink";
import BookingRequestsModal from "../../modals/BookingRequestsModal";
// import EditListingModal from '../../components/modals/EditListingModal'; // We'll add this later
import "./MyListingsPage.css";

const MyListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  // const [editingListing, setEditingListing] = useState(null);

  useEffect(() => {
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
                  <ActionLink
                    onClick={() => alert("Edit feature coming soon!")}
                  >
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
      {/* {editingListing && (
        <EditListingModal
          listing={editingListing}
          onClose={() => setEditingListing(null)}
        />
      )} */}
    </div>
  );
};

export default MyListingsPage;
