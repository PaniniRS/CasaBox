import React, { useState } from "react";
// Make sure to import your CSS file in your actual project
import "./login.css";

const App = () => {
  // State to manage which form is displayed
  const [formState, setFormState] = useState("login"); // 'login', 'register1', 'register2'

  // State for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [streetName, setStreetName] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [number, setNumber] = useState("");

  // State for handling messages from the backend
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Clear messages whenever the form view changes
  const switchForm = (form) => {
    setError("");
    setSuccess("");
    setFormState(form);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:6080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Login failed. Please check your credentials."
        );
      }

      setSuccess(data.message || "Login successful! Redirecting...");
      console.log("Login successful:", data);
      // Example: setTimeout(() => window.location.href = '/dashboard', 2000);
    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError(
          "Network Error: Could not connect to server. Please ensure the backend is running and CORS is configured correctly."
        );
      } else {
        setError(err.message);
      }
    }
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Final step of registration
    const registrationData = {
      username,
      email,
      password,
      streetName,
      city,
      postalCode,
      number,
    };

    try {
      const response = await fetch("http://localhost:6080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setSuccess(data.message || "Registration successful! Please log in.");
      console.log("Registration successful:", data);
      // Switch to login form after successful registration
      setTimeout(() => switchForm("login"), 2000);
    } catch (err) {
      console.error("Registration error:", err);
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError(
          "Network Error: Could not connect to server. Please ensure the backend is running and CORS is configured correctly."
        );
      } else {
        setError(err.message);
      }
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // If passwords match, proceed to the next step
    switchForm("register2");
  };

  // ===============================================================
  //                      RENDER LOGIC
  // ===============================================================

  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="form">
      <div className="input-group">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="input-field"
          required
        />
      </div>
      <div className="input-group large-margin">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="input-field"
          required
        />
      </div>
      <div className="button-group">
        <button type="submit" className="btn btn-primary">
          Log In
        </button>
        <button
          type="button"
          onClick={() => switchForm("register1")}
          className="btn btn-secondary"
        >
          Register
        </button>
      </div>
    </form>
  );

  const renderRegisterStep1 = () => (
    <form onSubmit={handleNextStep} className="form">
      <div className="input-group">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="input-field"
          required
        />
      </div>
      <div className="input-group">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="input-field"
          required
        />
      </div>
      <div className="input-group">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="input-field"
          required
        />
      </div>
      <div className="input-group large-margin">
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="input-field"
          required
        />
      </div>
      <div className="button-group">
        <button
          type="button"
          onClick={() => switchForm("login")}
          className="btn btn-primary"
        >
          Log In
        </button>
        <button type="submit" className="btn btn-secondary">
          Next →
        </button>
      </div>
    </form>
  );

  const renderRegisterStep2 = () => (
    <form onSubmit={handleRegistrationSubmit} className="form">
      <div className="input-group">
        <input
          type="text"
          value={streetName}
          onChange={(e) => setStreetName(e.target.value)}
          placeholder="Street Name"
          className="input-field"
          required
        />
      </div>
      <div className="input-group">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="input-field"
          required
        />
      </div>
      <div className="input-group large-margin input-row">
        <input
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          placeholder="Postal Code"
          className="input-field"
          required
        />
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Number"
          className="input-field"
          required
        />
      </div>
      <div className="button-group">
        <button
          type="button"
          onClick={() => switchForm("register1")}
          className="btn btn-primary"
        >
          ← Back
        </button>
        <button type="submit" className="btn btn-secondary">
          Done
        </button>
      </div>
    </form>
  );

  return (
    <div className="app-container">
      <div className="login-wrapper">
        <div className="form-panel">
          <h1>CasaBox</h1>

          {formState === "login" && renderLoginForm()}
          {formState === "register1" && renderRegisterStep1()}
          {formState === "register2" && renderRegisterStep2()}

          <div className="message-container">
            {error && <p className="message-error">{error}</p>}
            {success && <p className="message-success">{success}</p>}
          </div>
        </div>
        <div className="decorative-panel"></div>
      </div>
    </div>
  );
};

export default App;
