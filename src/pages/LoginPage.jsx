import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Login from "../components/Login";

function LoginPage() {
  return (
    <div>
      <Navbar />
      <Login />
    </div>
  );
}

export default LoginPage;
