import React, { useState } from "react";
import axios from "axios";
import API_URL from "../config/api";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.post(`${API_URL}/api/contact`, formData); // ✅ use response if needed
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });

      // reset success after 3s
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-main">
      <div className="contact-container">
        <div className="contact-info">
          <h3>Contact Information</h3>
          <ul>
            <li>
              <strong>Email:</strong> support@communitysolver.com
            </li>
            <li>
              <strong>Phone:</strong> +91 98765 43210
            </li>
            <li>
              <strong>Address:</strong> Vijayawada, Andhra Pradesh
            </li>
          </ul>
        </div>

        <div className="contact-form-section">
          <h3>Send us a message</h3>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>

            {error && (
              <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
            )}
            {success && (
              <p style={{ color: "green", marginTop: "10px" }}>
                Thank you for contacting us! We will get back to you soon.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
