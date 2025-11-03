import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config/api";

function AllReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, in-progress, resolved

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/report`);
      setReports(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setLoading(false);
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      garbage: "Garbage",
      lighting: "Street Light",
      road: "Road Damage",
      water: "Water Leakage",
    };
    return labels[category] || category;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "#2ecc71";
      case "In Progress":
        return "#f39c12";
      case "Pending":
        return "#e74c3c";
      default:
        return "#95a5a6";
    }
  };

  const filteredReports = reports.filter((report) => {
    if (filter === "all") return true;
    return report.status.toLowerCase().replace(" ", "-") === filter;
  });

  // Function to get file URL for a report
  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    // For now, we'll assume local development path
    // In production, you'd need to integrate with cloud storage
    return `${API_URL}/uploads/${filePath}`;
  };

  return (
    <div className="all-reports-container">
      <div className="all-reports-header">
        <h2>All Reported Issues</h2>
        <p>View all community problems and their current status</p>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All ({reports.length})
        </button>
        <button
          className={`filter-btn ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pending ({reports.filter((r) => r.status === "Pending").length})
        </button>
        <button
          className={`filter-btn ${filter === "in-progress" ? "active" : ""}`}
          onClick={() => setFilter("in-progress")}
        >
          In Progress ({reports.filter((r) => r.status === "In Progress").length})
        </button>
        <button
          className={`filter-btn ${filter === "resolved" ? "active" : ""}`}
          onClick={() => setFilter("resolved")}
        >
          Resolved ({reports.filter((r) => r.status === "Resolved").length})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Loading reports...</p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>No reports found.</p>
        </div>
      ) : (
        <div className="reports-grid">
          {filteredReports.map((report) => (
            <div key={report._id} className="report-card">
              {report.file && (
                <div className="report-card-image">
                  <img
                    src={getFileUrl(report.file)}
                    alt={report.name}
                    onError={(e) => {
                      // If the image fails to load, it might be because it's not accessible
                      // In Vercel deployments, files in /tmp are not publicly accessible
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="report-card-content">
                <h3>{report.name}</h3>
                <p className="report-description">{report.description}</p>
                <div className="report-meta">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(report.status) }}
                  >
                    {report.status}
                  </span>
                  <span className="category-badge">
                    {getCategoryLabel(report.category)}
                  </span>
                </div>
                {report.createdAt && (
                  <p className="report-date">
                    Reported: {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllReports;