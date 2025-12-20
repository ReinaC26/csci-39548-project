import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Signup from "../components/Signup";

function SignupPage() {
  return (
    <div className="min-h-screen animate-gradientShift bg-[linear-gradient(#0f2027_0%,#1d1d1d_50%,#1d1d1d_75%,#1d1d1d_100%)] bg-[length:400%_400%]">
      <Navbar />
      <Signup />
    </div>
  );
}

export default SignupPage;
