import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_URL from "../config/api";

function Report() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('description', form.description);
      if (form.file) {
        formData.append('file', form.file);
      }

      const response = await axios.post(`${API_URL}/api/report`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(true);
      setForm({ name: "", category: "", description: "", file: null });
      // Reset file input
      document.querySelector('input[type="file"]').value = '';
      
      setTimeout(() => {
        setSuccess(false);
        // Optionally redirect to view all reports
        // window.location.href = '/reports';
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Report a Community Problem</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Problem Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="garbage">Garbage</option>
          <option value="lighting">Street Light</option>
          <option value="road">Road Damage</option>
          <option value="water">Water Leakage</option>
        </select>

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          required
        ></textarea>

        <label>Upload Image</label>
        <input type="file" name="file" onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Report"}
        </button>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        {success && (
          <div style={{ marginTop: "15px" }}>
            <p style={{ color: "green", marginBottom: "10px" }}>Problem reported successfully!</p>
            <Link to="/reports" style={{ textDecoration: "none" }}>
              <button 
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                View All Reports →
              </button>
            </Link>
          </div>
        )}
      </form>
    </div>
  );
}

export default Report;
