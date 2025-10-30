import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Signup from "../components/Signup";

function SignupPage() {
  return (
    <div>
      <Navbar />
      <Signup />
    </div>
  );
}

export default SignupPage;
