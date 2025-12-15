import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Left Links */}
        <div className="nav-links">
          <NavLink 
            to="/" className={({ isActive }) => (isActive ? 'active' : '')}
            >Home</NavLink>
          <NavLink to="/questgenerator" className={({ isActive }) => (isActive ? 'active' : '')}
          >Quest Generator</NavLink>
        </div>

        {/* Center Logo */}
        <NavLink to="/" className="nav-logo">
          SerendiQuest
        </NavLink>

        {/* Right Links */}
        <div className="nav-links">
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}
          >About</NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}
          >Profile</NavLink>
          <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}
          >Login</NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
