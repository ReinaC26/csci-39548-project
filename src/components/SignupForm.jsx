import React, { useState, useEffect } from "react";
import "./Login.css";

function SignupForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [matchPassword, setMatchPassword] = useState("");

  // check between password and confirm password
  useEffect(() => {
    if (!confirm) {
      setMatchPassword("");
      return;
    }

    if (password === confirm) {
      setMatchPassword("match");
    } else {
      setMatchPassword("mismatch");
    }
  }, [password, confirm]);

  return (
    <form className="login-form">
      <label>Name</label>
      <input type="text" placeholder="Username" required />

      <label>Email</label>
      <input type="email" placeholder="address@example.com" required />

      <label>Password</label>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <label>Confirm password</label>
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />

      {matchPassword === "mismatch" && (
        <p
          style={{ color: "#e74c3c", fontSize: "0.9rem", marginTop: "0.3rem" }}
        >
          ❌ Passwords do not match
        </p>
      )}
      {matchPassword === "match" && (
        <p
          style={{ color: "#27ae60", fontSize: "0.9rem", marginTop: "0.3rem" }}
        >
          ✅ Passwords match
        </p>
      )}

      <button type="submit" className="login-btn">
        Confirm
      </button>
    </form>
  );
}

export default SignupForm;
