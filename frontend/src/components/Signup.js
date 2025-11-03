import React, { useState } from "react";
import axios from "axios";
import API_URL from "../config/api";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Send signup request to the backend
      const response = await axios.post(`${API_URL}/api/auth/signup`, formData);
      console.log(response.data); // Handle the response from the backend
      // Store token in localStorage for future requests
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      // Redirect to home after successful signup
      window.location.href = '/';
    } catch (err) {
      console.error('Signup error:', err);
      if (err.response) {
        // Server responded with error
        setError(err.response.data?.error || err.response.data?.message || "Signup failed. Please try again.");
      } else if (err.request) {
        // Request made but no response (server might be down)
        setError("Cannot connect to server. Please make sure the backend server is running on port 5000.");
      } else {
        // Something else happened
        setError(err.message || "Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Inline styles
  const styles = {
    page: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f5f5f5",
    },
    container: {
      backgroundColor: "#fff",
      padding: "2rem",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      width: "300px",
    },
    input: {
      width: "100%",
      padding: "0.8rem",
      marginBottom: "1rem",
      border: "1px solid #ddd",
      borderRadius: "4px",
    },
    button: {
      width: "100%",
      padding: "0.8rem",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    errorMessage: {
      color: "red",
      textAlign: "center",
      marginTop: "1rem",
    },
    link: {
      textAlign: "center",
      marginTop: "1rem",
    },
    linkText: {
      color: "#4CAF50",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            style={styles.input}
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          {error && <p style={styles.errorMessage}>{error}</p>}
        </form>
        <div style={styles.link}>
          <p>
            Already have an account?{" "}
            <a href="/login" style={styles.linkText}>
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
