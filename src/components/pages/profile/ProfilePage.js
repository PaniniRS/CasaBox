import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/layout/Header";
import EditAccountModal from "../../../components/modals/EditAccountModal";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/auth/session", { credentials: "include" });
      const result = await response.json();
      if (result.success) {
        setUser(result.user);
      } else {
        navigate("/login");
      }
    } catch (error) {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [navigate]);

  const handlePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const response = await fetch("/auth/update-picture", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        fetchUserProfile();
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Failed to upload picture.");
    }
  };

  const handleLogout = async () => {
    await fetch("/auth/logout", { method: "POST", credentials: "include" });
    navigate("/login");
  };

  if (loading || !user) {
    return <div>Loading profile...</div>;
  }

  const profileImageUrl = user.ProfilePictureURL
    ? `http://88.200.63.148:3080/${user.ProfilePictureURL}`
    : `https://placehold.co/179x179/673333/FFFFFF?text=${user.Username.charAt(
        0
      ).toUpperCase()}`;

  const addressParts = [user.StreetName, user.PostalCode, user.City].filter(
    Boolean
  );
  const displayAddress = addressParts.join(", ");

  return (
    <div className="profile-page">
      <Header />
      <main className="profile-content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-picture-container">
              <img
                src={profileImageUrl}
                alt="Profile"
                className="profile-picture-big"
              />
              <button
                className="edit-picture-btn"
                onClick={() => fileInputRef.current.click()}
              >
                ✏️
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handlePictureUpload}
                accept="image/*"
              />
            </div>
            <div className="profile-info">
              <h1 className="profile-name">
                {user.FirstName} {user.LastName}
                {user.Role === "Admin" && (
                  <span className="admin-badge">Admin</span>
                )}
              </h1>
              <p className="profile-username">@{user.Username}</p>
            </div>
          </div>
          <p className="profile-address">
            <strong>Address:</strong> {displayAddress || "Not provided"}
          </p>
          <div className="ratings-container">
            <div className="rating-item">
              <h3>Provider Rating</h3>
              <p>{user.AverageProviderRating || "N/A"} / 5</p>
            </div>
            <div className="rating-item">
              <h3>Seeker Rating</h3>
              <p>{user.AverageSeekerRating || "N/A"} / 5</p>
            </div>
          </div>
        </div>

        <div className="actions-panel">
          <div className="action-buttons-top">
            <button className="action-btn">My listings</button>
            <button className="action-btn">My Bookings</button>
            <button className="action-btn">My Seals</button>
          </div>
          <div className="action-buttons-bottom">
            <button
              className="action-btn"
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Account
            </button>
            <button className="action-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </main>

      {isEditModalOpen && (
        <EditAccountModal
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false);
            fetchUserProfile();
          }}
        />
      )}
    </div>
  );
};

export default ProfilePage;
