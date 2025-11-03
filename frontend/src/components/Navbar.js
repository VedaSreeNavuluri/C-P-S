// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css"; // optional styling

function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <h2 className="logo">Community Problem Solver</h2>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/report">Report</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/pastworks">Past Works</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link to="/reports">All Reports</Link></li>
            <li>
              <button onClick={logout} className="nav-button">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;