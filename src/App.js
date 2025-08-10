import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your components from their new locations
import LoginSite from "./components/pages/login/loginSite";
import Landing from "./components/pages/landing/landing";
import BookingItem from "./components/booking/bookingCard";
import BookingView from "./components/booking/bookingView";
import CreateListing from "./components/pages/listing/CreateListing";
import SearchResultsPage from "./components/pages/searchResults/SearchResults";

// Import your main CSS file
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* The root path "/" will render your login page */}
        <Route path="/" element={<LoginSite />} />

        <Route path="/home" element={<Landing />} />

        {/* A specific /login route is also good practice */}
        <Route path="/login" element={<LoginSite />} />

        {/* Routes for the new booking components */}
        <Route path="/booking-view" element={<BookingView />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/listings/new" element={<CreateListing />} />
        <Route path="/listing/:id" element={<BookingView />} />
      </Routes>
    </Router>
  );
}

export default App;
