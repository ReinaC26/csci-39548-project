import React, { useState } from "react";
import "./Login.css";

function FindAccount() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      const response = await fetch(`https://csci-39548-project.onrender.com/api/auth/find-account?username=${username}&email=${email}`);
      const data = await response.json();

      if (response.ok) {
        alert("Account found!");
      } else {
        alert(data.message || "Account not found.");
      }
    } catch (error) {
      console.error("Error finding account:", error);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2 className="login-subtitle">Find my account</h2>
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

      <button type="submit" className="login-btn">
        Search
      </button>
    </form>
  );
}

export default FindAccount;