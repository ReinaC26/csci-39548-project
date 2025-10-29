import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Left Links */}
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/questgenerator">Quest Generator</Link>
        </div>

        {/* Center Logo */}
        <Link to="/" className="nav-logo">
          SerendiQuest
        </Link>

        {/* Right Links */}
        <div className="nav-links">
          <Link to="/about">About</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
