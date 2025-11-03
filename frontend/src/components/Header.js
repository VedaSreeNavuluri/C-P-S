import React from "react";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  return (
    <header className="main-header">
      <nav className="main-nav">
        <h1>Community Problem Solver</h1>
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-button ${location.pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/report"
            className={`nav-button ${
              location.pathname === "/report" ? "active" : ""
            }`}
          >
            Report
          </Link>
          <Link
            to="/contact"
            className={`nav-button ${
              location.pathname === "/contact" ? "active" : ""
            }`}
          >
            Contact
          </Link>
          <Link
            to="/reports"
            className={`nav-button ${
              location.pathname === "/reports" ? "active" : ""
            }`}
          >
            All Reports
          </Link>
          <Link
            to="/pastworks"
            className={`nav-button ${
              location.pathname === "/pastworks" ? "active" : ""
            }`}
          >
            Past Works
          </Link>
        </div>
      </nav>
      <p className="tagline">Connecting communities, solving problems together</p>
    </header>
  );
}

export default Header;

