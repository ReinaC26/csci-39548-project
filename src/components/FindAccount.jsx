import React from "react";
import "./Login.css";

function FindAccount() {
  return (
    <form className="login-form">
      <h2 className="login-subtitle">Find my account</h2>
      <hr className="divider" />

      <label>Name</label>
      <input type="text" placeholder="Username" required />

      <label>Email</label>
      <input type="email" placeholder="address@example.com" required />

      <button type="submit" className="login-btn">
        Search
      </button>
    </form>
  );
}

export default FindAccount;
