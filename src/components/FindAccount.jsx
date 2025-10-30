import React from "react";
import "./Login.css";

function FindAccount() {
  return (
    <form className="login-form">
      <h2 className="login-subtitle">Find my account</h2>
      <hr className="divider" />

      <label>Email</label>
      <input type="email" placeholder="address@example.com" required />

      <label>Password</label>
      <input type="password" placeholder="Password" required />

      <button type="submit" className="login-btn">
        Search
      </button>
    </form>
  );
}

export default FindAccount;
