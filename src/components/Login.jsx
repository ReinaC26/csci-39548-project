import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import LoginForm from "./LoginForm";
import FindAccount from "./FindAccount";

function Login() {
  const [isFindMode, setIsFindMode] = useState(false); 

  const bgStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${process.env.PUBLIC_URL}/LoginBackground.png)`,
  };

  return (
    <div className="login-container" style={bgStyle}>
      <div className="login-box">
        <h1 className="login-title">SerendiQuest</h1>

        {isFindMode ? <FindAccount /> : <LoginForm />}

        <button
          className="toggle-btn"
          type="button" 
          onClick={(e) => {
            e.preventDefault(); // Stop page refresh
            e.stopPropagation(); // Stop event bubbling
            setIsFindMode(!isFindMode);
          }}
        >
          {isFindMode ? "Back to Login" : "Find Account"}
        </button>
        
        <hr className="divider" />

        <Link to="/signup" className="create-btn">
          Create new account
        </Link>
      </div>
    </div>
  );
}

export default Login;