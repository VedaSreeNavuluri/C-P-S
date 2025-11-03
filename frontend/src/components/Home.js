import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import garbageImg from "../assets/trash.jpg";
import streetlightImg from "../assets/pole.jpeg";
import potholeImg from "../assets/pothle.jpg";

function Home() {
  const problems = [
    {
      id: 1,
      title: "Garbage collection issue",
      description: "Overflowing bins in Sector 5 causing foul smell.",
      status: "Unresolved",
      img: garbageImg,
    },
    {
      id: 2,
      title: "Street light not working",
      description: "Main road lights have been off for 3 days.",
      status: "In Progress",
      img: streetlightImg,
    },
    {
      id: 3,
      title: "Potholes on road",
      description: "Deep potholes on school road causing accidents.",
      status: "Resolved",
      img: potholeImg,
    },
  ];

  return (
    <section className="problems-section">
      <h2>Current Community Problems</h2>

      {problems.map((p) => (
        <div key={p.id} className="problem-card">
          <img src={p.img} alt={p.title} />
          <div className="problem-info">
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <span
              className={`status ${p.status.toLowerCase().replace(" ", "-")}`}
            >
              {p.status}
            </span>
          </div>
        </div>
      ))}

      {/* The top-right buttons (Login and Signup) */}
      <div className="auth-buttons-top">
        <Link to="/login">
          <button className="auth-btn">Login</button>
        </Link>
        <Link to="/signup">
          <button className="auth-btn">Signup</button>
        </Link>
      </div>

      {/* Past Works Section */}
      <div className="past-works-section">
        <div className="past-works-content">
          <div className="past-works-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
            </svg>
          </div>
          <div className="past-works-text">
            <h3>See What We've Accomplished</h3>
            <p>Explore our past community works and see how we've made a difference together!</p>
          </div>
          <Link to="/pastworks">
            <button className="past-works-btn">
              View Past Works
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginLeft: "8px" }}
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Home;
