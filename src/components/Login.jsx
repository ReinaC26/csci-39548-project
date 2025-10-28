import React, { useState } from "react";
import "./Login.css";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

function Login() {
  const [isSignup, setIsSignup] = useState(false);

  const bgStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/LoginBackground.png)`,
  };

  return (
    <div className="login-container" style={bgStyle}>
      <div className="login-box">
        <h1 className="login-title">SerendiQuest</h1>

        {isSignup ? <SignupForm /> : <LoginForm />}

        <hr className="divider" />

        <button className="create-btn" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Back to Login" : "Create new account"}
        </button>
      </div>
    </div>
  );
}

export default Login;
