//create simple h1 landing page
import React from "react";
import { Link } from "react-router-dom";
import "./landing.css";
const Landing = () => {
  return (
    <div className="landing-container">
      <h1>Welcome to CasaBox</h1>
      <p>Your home for all things CasaBox.</p>
      <Link to="/login" className="landing-link">
        Login
      </Link>
      <Link to="/register" className="landing-link">
        Register
      </Link>
    </div>
  );
};
export default Landing;
// This is a simple landing page component for CasaBox. It includes links to login and register
// and is styled with a basic CSS file. The component uses React Router's Link component
