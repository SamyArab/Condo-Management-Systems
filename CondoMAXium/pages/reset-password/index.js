import React, { useState, useEffect } from 'react';
import supabase from "../../config/supabaseClient";
import { useRouter } from "next/router";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";


const defaultTheme = createTheme();

/**
 * This function is used to reset the password for a given email.
 * It updates the user's password using the Supabase auth service. If the password update is successful,
 * it alerts the user and redirects them to the home page. If any error occurs during this process,
 * it logs the error message.
 *
 * @example
 * // Assuming the function is invoked somewhere in a form submit event
 * <form onSubmit={ResetPassword}>
 *   <input type="email" onChange={e => setEmail(e.target.value)} />
 *   <input type="password" onChange={e => setNewPassword(e.target.value)} />
 *   <button type="submit">Reset Password</button>
 * </form>
 *
 * @returns {void} This function does not return anything.
 */
function ResetPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const router = useRouter();

  const handleResetPassword = async (event) => {
    event.preventDefault();
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
    } catch (error) {
      console.error("Error resetting password:", error.message);
      return;
    }
    alert("Password reset succeeded!");
    router.push('/');
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
              <LockResetOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant='h5'>
              Reset Password
            </Typography>
            <Box component="form" noValidate onSubmit={handleResetPassword} sx={{mt: 3}}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    type="password"
                    value={newPassword}
                    label="New Password"
                    placeholder="New Password" 
                    onChange = {(e) => setNewPassword(e.target.value)} />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant='contained'
                onClick={handleResetPassword}
                sx={{mt: 3, mb: 2}}>
                  Reset Password
                </Button>
            </Box>
          </Box>
      </Container>
    </ThemeProvider>
    /* <div>
        <h1>Reset Password</h1>
        <form>
          <label>
            New Password:
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </label>
          <button type="submit"
            onClick={handleResetPassword}
          >Reset</button>
        </form>
      </div></> */
  );
}

export default ResetPassword;