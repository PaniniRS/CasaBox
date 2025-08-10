import React, { useState, useEffect } from "react";
import Header from "../../layout/Header";
import SearchBar from "../../search/SearchBar";
import BookingCard from "../../booking/bookingCard";
import "./landing.css";

const Landing = () => {
  const [listings, setListings] = useState([]);
  const [mapUrl, setMapUrl] = useState("");
  const [error, setError] = useState("");

  // Fetch all listings on component mount
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("/listings/all");
        const result = await response.json();
        if (result.success) {
          setListings(result.data);
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        setError("Could not fetch listings.");
      }
    };

    fetchListings();
  }, []);

  // Get user's location for the map
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          // Construct OpenStreetMap URL
          const url = `https://www.openstreetmap.org/export/embed.html?bbox=${
            longitude - 0.1
          },${latitude - 0.1},${longitude + 0.1},${
            latitude + 0.1
          }&layer=mapnik`;
          setMapUrl(url);
        },
        () => {
          // Fallback to a default location if access is denied
          setMapUrl(
            "https://www.openstreetmap.org/export/embed.html?bbox=13.5,45.5,13.6,45.6&layer=mapnik"
          );
        }
      );
    }
  }, []);

  return (
    <div className="landing-page">
      <Header />

      <main>
        <div className="hero-section">
          {mapUrl && (
            <iframe
              title="map"
              src={mapUrl}
              className="map-background"
            ></iframe>
          )}
          <div className="hero-overlay">
            <SearchBar />
            <div className="scroll-indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>

        <div className="listings-section">
          <h2 className="listings-title">Featured Listings</h2>
          {error && <p className="error-message">{error}</p>}
          <div className="listings-grid">
            {listings.map((listing) => (
              <BookingCard key={listing.ListingID} listing={listing} />
            ))}
          </div>
          {/* Pagination would go here */}
        </div>
      </main>
    </div>
  );
};

export default Landing;
