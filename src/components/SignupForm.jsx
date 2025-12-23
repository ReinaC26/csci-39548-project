import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_BASE_URL = "https://csci-39548-project.onrender.com";

function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [isMatch, setIsMatch] = useState(null);

  const navigate = useNavigate();

  // check between password and confirm password
  useEffect(() => {
    if (!confirm) {
      setIsMatch(null);
      return;
    }
    setIsMatch(password === confirm);
  }, [password, confirm]);

  // Sin-up form Submit
  const handleSubmit = async (e) => {
    // prevent collison with previous log
    e.preventDefault();

    // check filled out
    if (!username || !email || !password) {
      alert("Please fill out all fields.");

      return;
    }
    if (password !== confirm) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message);
      }

      // if success, save token
      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      alert("Registered successfully!");

      // Jump to Home after Login processing
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2 className="login-subtitle">Sign-up</h2>
      <hr className="divider" />

      <label>Name</label>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

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

      <label>Confirm password</label>
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />

      {isMatch === false && (
        <p
          style={{ color: "#e74c3c", fontSize: "0.9rem", marginTop: "0.3rem" }}
        >
          ❌ Passwords do not match
        </p>
      )}
      {isMatch === true && (
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
