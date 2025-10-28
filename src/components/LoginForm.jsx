import React from "react";
import "./Login.css";

function LoginForm() {
  return (
    <form className="login-form">
      <h2 className="login-subtitle">Login</h2>
      <hr className="divider" />

      <label>Email</label>
      <input type="email" placeholder="address@example.com" required />

      <label>Password</label>
      <input type="password" placeholder="Password" required />

      <button type="submit" className="login-btn">
        Log-in
      </button>
      <a href="/login" className="forgot-link">
        forgot account?
      </a>
    </form>
  );
}

export default LoginForm;
