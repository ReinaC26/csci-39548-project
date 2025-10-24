import React from 'react';
import './Navbar.css';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="nav-container">
                {/* Left Links */}
                <div className="nav-links">
                    <a href="/home">Home</a>
                    <a href="/questgenerator">Quest Generator</a>
                </div>

                {/* Center Logo */}
                <a href="/" className="nav-logo">SerendiQuest</a>

                {/* Right Links */}
                <div className="nav-links">
                <a href="/about">About</a>
                    <a href="/profile">Profile</a>
                    <a href="/login">Login</a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
