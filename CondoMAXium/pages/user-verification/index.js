import React from "react";
import supabase from "../../config/supabaseClient";
import { useState } from "react";
import { useRouter } from "next/router";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { WindowSharp } from "@mui/icons-material";

function VerifyOTP() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleVerify = async (event) => {
    event.preventDefault();
    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: otp,
      type: 'email',
    });
    if (error) {
      console.error("Error verifying OTP:", error.message);
    } 
    else {
      // Redirect to the form page after successful OTP verification
      router.push('/profile-form');
    }
  };

  return (
    <div>
      <h1>Verify OTP</h1>
      <form onSubmit={handleVerify}>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          OTP:
          <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
        </label>
        <button type="submit">Verify</button>
      </form>
    </div>
  );
}

export default VerifyOTP;