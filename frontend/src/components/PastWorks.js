import React, { useEffect, useState } from "react";
import axios from "axios";
import garbageImg from "../assets/trash.jpg";
import streetlightImg from "../assets/pole.jpeg";
import potholeImg from "../assets/pothle.jpg";
import API_URL from "../config/api";

function PastWorks() {
  const [pastReports, setPastReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample data to show if no resolved reports exist
  const sampleWorks = [
    {
      _id: "sample1",
      name: "Street Lighting Fixed",
      description: "Successfully repaired all non-functional street lights in Sector 5. The area is now well-lit and safe for evening walks.",
      category: "lighting",
      status: "Resolved",
      file: null,
      isSample: true,
      img: streetlightImg,
    },
    {
      _id: "sample2",
      name: "Garbage Collection Improved",
      description: "Coordinated with local municipality to improve garbage collection frequency. Overflowing bins are now cleared regularly.",
      category: "garbage",
      status: "Resolved",
      file: null,
      isSample: true,
      img: garbageImg,
    },
    {
      _id: "sample3",
      name: "Potholes Repaired",
      description: "Major potholes on Main Street were filled and the road was resurfaced. Traffic flow has improved significantly.",
      category: "road",
      status: "Resolved",
      file: null,
      isSample: true,
      img: potholeImg,
    },
  ];

  useEffect(() => {
    // Fetch resolved reports from your backend
    axios
      .get(`${API_URL}/api/report`)
      .then((res) => {
        const resolved = res.data.filter((report) => report.status === "Resolved");
        // If we have resolved reports, use them; otherwise show sample data
        setPastReports(resolved.length > 0 ? resolved : sampleWorks);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching past works:", err);
        // On error, show sample data
        setPastReports(sampleWorks);
        setLoading(false);
      });
  }, []);

  const getCategoryLabel = (category) => {
    const labels = {
      garbage: "Garbage",
      lighting: "Street Light",
      road: "Road Damage",
      water: "Water Leakage",
    };
    return labels[category] || category;
  };

  return (
    <div className="past-works-container">
      <div className="past-works-header">
        <h2>Past Community Works</h2>
        <p>Take a look at the problems our community has already solved together.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Loading past works...</p>
        </div>
      ) : (
        <div className="past-works-grid">
          {pastReports.map((report) => (
            <div key={report._id} className="work-card">
              <div className="work-card-image">
                <img
                  src={
                    report.file
                      ? `${API_URL}${report.file}`
                      : report.isSample && report.img
                      ? report.img
                      : "https://via.placeholder.com/400x200?text=Community+Work"
                  }
                  alt={report.name}
                />
                <div className="work-card-badge">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 11l3 3L22 4"></path>
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                  </svg>
                  Resolved
                </div>
              </div>
              <div className="work-card-content">
                <h3>{report.name}</h3>
                <p>{report.description}</p>
                <div className="work-card-tags">
                  <span className="tag-category">{getCategoryLabel(report.category)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PastWorks;
