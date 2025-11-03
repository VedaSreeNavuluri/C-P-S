// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // optional styling

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">Community Problem Solver</h2>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/report">Report</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/pastworks">Past Works</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
