import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_BASE_URL = "https://csci-39548-project.onrender.com";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const navigate = useNavigate();

  // Sign-in form Submit
  const handleSubmit = async (e) => {
    // prevent collison with previous log
    e.preventDefault();

    // check filled out
    if (!email || !password) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // if failed,
      if (!res.ok) {
        throw new Error(data?.message);
      }

      // if success, save token
      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      alert(`Welcome, ${data.user.username}! `);

      // Jump to Home after Login
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2 className="login-subtitle">Login</h2>
      <hr className="divider" />

      <label>Email</label>
      <input
        type="email"
        placeholder="address@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label>Password</label>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" className="login-btn">
        Log-in
      </button>
    </form>
  );
}

export default LoginForm;
