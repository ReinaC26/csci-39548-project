import React, { useState } from "react";
import "./Login.css";
import LoginForm from "./LoginForm";
import FindAccount from "./FindAccount";

function Login() {
  const [isFindMode, setIsFindMode] = useState("");
  const bgStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/LoginBackground.png)`,
  };

  return (
    <div className="login-container" style={bgStyle}>
      <div className="login-box">
        <h1 className="login-title">SerendiQuest</h1>

        {isFindMode ? <FindAccount /> : <LoginForm />}

        <button
          className="toggle-btn"
          onClick={() => setIsFindMode(!isFindMode)}
        >
          {isFindMode ? "Back to Login" : "Find Account"}
        </button>
        <hr className="divider" />

        <a href="/signup" className="create-btn">
          Create new account
        </a>
      </div>
    </div>
  );
}

export default Login;
