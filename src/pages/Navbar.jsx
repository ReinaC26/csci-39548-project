import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert(`See you soon, ${user.username}`);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Left Links */}
        <div className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>
          <NavLink
            to="/questgenerator"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Quest Generator
          </NavLink>
        </div>

        {/* Center Logo */}
        <NavLink to="/" className="nav-logo">
          SerendiQuest
        </NavLink>

        {/* Right Links */}
        <div className="nav-links">
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            About
          </NavLink>
          {token && user?.username ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {user.username}'s Profile
              </NavLink>

              <button onClick={handleLogout} className="logout-link">
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
