import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your components from their new locations
import LoginSite from "./components/login/loginSite.js";
import Landing from "./components/landing/landing";
import BookingView from "./components/booking/bookingView.js";

// Import your main CSS file
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* The root path "/" will render your login page */}
        <Route path="/" element={<LoginSite />} />

        {/* The /landing path for after a user logs in */}
        <Route path="/home" element={<Landing />} />

        {/* A specific /login route is also good practice */}
        <Route path="/login" element={<LoginSite />} />

        {/* Booking part for opening a booking */}
        <Route path="/booking" element={<BookingView />} />
      </Routes>
    </Router>
  );
}

export default App;
