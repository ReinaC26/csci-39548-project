import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import SignupForm from "./SignupForm";

function Signup() {
  const bgStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${process.env.PUBLIC_URL}/LoginBackground.png)`,
  };

  return (
    <div className="login-container" style={bgStyle}>
      <div className="login-box">
        <h1 className="login-title">SerendiQuest</h1>

        <SignupForm />
        <hr className="divider" />

        <Link to="/login" className="create-btn">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
