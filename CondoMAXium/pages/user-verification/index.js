import React from "react";
import supabase from "../../config/supabaseClient";
import { useState } from "react";
import { useRouter } from "next/router";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const defaultTheme = createTheme();

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
      router.push('/reset-password');
    } 
    else {
      const { data: resetData, error: resetError } = await supabase.auth.resetPasswordForEmail(email);
      router.push('/reset-password');
    }
  };    

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth ="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop:20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
            <Avatar sx={{m: 1, bgcolor: "secondary.main"}}>
              <KeyOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant='h5'>
              Verify One Time Password
            </Typography>
            <Box component="form" noValidate onSubmit={handleVerify} sx={{mt: 3}}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    type='email'
                    label='Email Address'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                </Grid>
                <Grid item xs={12} >
                  <TextField
                    required
                    fullWidth
                    type="text"
                    label="One Time Password"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)} />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant='contained'
                onClick={handleVerify}
                sx={{mt: 3, mb: 2}}>
                  Verify
                </Button>
            </Box>
          </Box>
      </Container>
    </ThemeProvider>
     /* <div>
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
     </div> */
  );
}

export default VerifyOTP;