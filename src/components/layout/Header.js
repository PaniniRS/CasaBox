import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [location, setLocation] = useState("Fetching location...");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/auth/session", {
          credentials: "include",
        });
        const result = await response.json();
        if (result.success) {
          setUser(result.user);
        }
      } catch (error) {
        console.error("Could not check session:", error);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setLocation(data.address.city || data.address.country);
          } catch (error) {
            setLocation("Location not found");
          }
        },
        () => {
          setLocation("Location access denied");
        }
      );
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/auth/logout", { method: "POST", credentials: "include" });
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <Link to="/home" className="logo-container">
          <h1 className="logo-title">CasaBox</h1>
          <span className="location-text">{location}</span>
        </Link>
        <nav className="main-nav">
          {user ? (
            <div className="nav-user-section">
              <button
                onClick={() => navigate("/listings/new")}
                className="nav-button create-listing"
              >
                Create Listing
              </button>
              <button onClick={handleLogout} className="nav-button logout">
                Log Out
              </button>
              <img
                src={
                  user.ProfilePictureURL
                    ? `http://88.200.63.148:3080/${user.ProfilePictureURL}`
                    : `https://placehold.co/40x40/f87171/white?text=${user.Username.charAt(
                        0
                      ).toUpperCase()}`
                }
                alt="User profile"
                className="profile-picture"
                onClick={() => navigate("/profile")} // <-- ADDED THIS ONCLICK HANDLER
              />
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="nav-button login"
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/login")}
                className="nav-button register"
              >
                Register
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
