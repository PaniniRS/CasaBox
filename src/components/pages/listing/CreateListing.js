import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/layout/Header";
import "./CreateListing.css";

const CreateListing = () => {
  const [storageType, setStorageType] = useState("ItemSlot"); // 'ItemSlot' or 'SquareMeter'
  const [priceUnit, setPriceUnit] = useState("per item / day");
  const [images, setImages] = useState([]); // Array of file objects
  const [primaryImage, setPrimaryImage] = useState(null); // The selected primary file object
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    capacity: "",
    streetName: "",
    city: "",
    postalCode: "",
    number: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 4) {
      setError("You can upload a maximum of 4 images.");
      return;
    }
    const newImages = [...images, ...files];
    setImages(newImages);
    // If no primary image is set, make the first one primary
    if (!primaryImage) {
      setPrimaryImage(newImages[0]);
    }
  };

  const removeImage = (imageToRemove) => {
    const newImages = images.filter((img) => img !== imageToRemove);
    setImages(newImages);
    // If the removed image was the primary one, reset primary image
    if (primaryImage === imageToRemove) {
      setPrimaryImage(newImages.length > 0 ? newImages[0] : null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    const data = new FormData();
    // Append all images
    images.forEach((img) => {
      data.append("listingImages", img);
    });
    // Append all other form data
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    // Append the new fields
    data.append("storageType", storageType);
    data.append("priceUnit", priceUnit);
    data.append("primaryImageName", primaryImage.name); // Send the name of the primary image

    try {
      const response = await fetch("/listings/create", {
        method: "POST",
        body: data,
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to create listing.");

      setSuccess("Listing created! Redirecting...");
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="create-listing-page">
      <Header />
      <main className="create-listing-content">
        <form className="listing-form" onSubmit={handleSubmit}>
          <h2>Create a New Listing</h2>

          <div className="form-group">
            <label>Storage Type</label>
            <div className="toggle-switch">
              <button
                type="button"
                onClick={() => setStorageType("ItemSlot")}
                className={storageType === "ItemSlot" ? "active" : ""}
              >
                By Item
              </button>
              <button
                type="button"
                onClick={() => setStorageType("SquareMeter")}
                className={storageType === "SquareMeter" ? "active" : ""}
              >
                By Area (m²)
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="priceUnit">Price Unit</label>
              <select
                id="priceUnit"
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value)}
              >
                <option>per item / day</option>
                <option>per item / week</option>
                <option>per m² / day</option>
                <option>per m² / week</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="capacity">
                {storageType === "ItemSlot" ? "Total Slots" : "Area (m²)"}
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <h3>Address</h3>
          <div className="form-group">
            <label htmlFor="streetName">Street Name</label>
            <input
              type="text"
              id="streetName"
              name="streetName"
              value={formData.streetName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row address-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="postalCode">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="number">Number</label>
              <input
                type="text"
                id="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
              />
            </div>
          </div>

          <h3>Images (1-4)</h3>
          <div className="form-group">
            <div className="image-previews">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`preview-container ${
                    primaryImage === img ? "primary" : ""
                  }`}
                  onClick={() => setPrimaryImage(img)}
                >
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`preview ${index}`}
                    className="image-preview"
                  />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(img);
                    }}
                  >
                    &times;
                  </button>
                  {primaryImage === img && (
                    <div className="primary-tag">Primary</div>
                  )}
                </div>
              ))}
            </div>
            {images.length < 4 && (
              <>
                <label htmlFor="listingImages" className="image-upload-label">
                  Upload Images
                </label>
                <input
                  type="file"
                  id="listingImages"
                  name="listingImages"
                  onChange={handleImageChange}
                  accept="image/*"
                  multiple
                />
              </>
            )}
          </div>

          <button type="submit" className="submit-btn">
            Create Listing
          </button>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </form>
      </main>
    </div>
  );
};

export default CreateListing;
