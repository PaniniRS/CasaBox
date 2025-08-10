import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../../components/layout/Header";
import BookingCard from "../../../components/booking/bookingCard";
import "./SearchResultsPage.css";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const query = searchParams.get("q");

  useEffect(() => {
    if (!query) {
      setIsLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(
          `/listings/search?q=${encodeURIComponent(query)}`
        );
        const result = await response.json();
        if (result.success) {
          setListings(result.data);
        } else {
          throw new Error(result.message || "Search failed");
        }
      } catch (err) {
        setError("Could not fetch search results.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="search-results-page">
      <Header />
      <main className="results-content">
        <h2 className="results-title">
          Search Results for: <em>"{query}"</em>
        </h2>
        {isLoading && <p className="loading-message">Loading...</p>}
        {error && <p className="error-message">{error}</p>}
        {!isLoading && !error && listings.length > 0 ? (
          <div className="listings-grid">
            {listings.map((listing) => (
              <BookingCard key={listing.ListingID} listing={listing} />
            ))}
          </div>
        ) : (
          !isLoading &&
          !error && (
            <p className="no-results-message">
              No listings found matching your search.
            </p>
          )
        )}
      </main>
    </div>
  );
};

export default SearchResultsPage;
