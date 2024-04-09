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

const defaultTheme = createTheme();

/*
export default function SignUp() {

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  console.log({
    email: data.get("email"),
    password: data.get("password"),
  });
};

let navigate = useNavigate();
const routeChange = () => {
  let path = "/profile";
  navigate(path);
}; */

// Mark and Nicolas' code
/*
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const navigate = useNavigate();

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      // options: {emailRedirectTo: "http://localhost:5173/signup"}
    });

    if (error) {
      throw error;
    }

    console.log("User signed up successfully:", data);
    routeChange();
  } catch (error) {
    console.error("Error signing up:", error);
  }
};

const routeChange = () => {
  let path = "/profile";
  handleSubmit;
  //navigate(path);
};
*/

// Nicola's new code, seems to be working
function SignUp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleSignUp = async (event) => {
    event.preventDefault(); // Prevent form from refreshing the page
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: true,
      },
    });
    if (error) {
      console.error("Error signing up:", error.message);
    } else {
      alert('OTP has been sent to your email');
    }
  };

  const handleVerify = async () => {
    
    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: otp,
      type: 'email',
    });
    if (error) {
      console.error("Error verifying OTP:", error.message);
    } else {
      // Redirect to the form page after successful OTP verification
      Window.alert("YYYYESSSS");
    }
  };
  

  // const routeChange = () => {
  //   let path = "/profile";
  //   console.log("Navigating to:", path);
  //   // Implement navigation logic here
  // };

  const router = useRouter();
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSignUp}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="otp"
                  label="OTP"
                  name="otp"
                  autoComplete="otp"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                />
              </Grid> */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={handleVerify}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign User Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
export default SignUp;

// const Signup = () => {
//   return (
//     <div className="container">
//       <div className="header">
//         <div className="text">CondoMAXium</div>
//       </div>
//       <div className="input">
//         <img src="" alt="" />
//         <input type="Username" />
//       </div>
//       <div className="input">
//         <img src="" alt="" />
//         <input type="Email" />
//       </div>
//       <div className="input">
//         <img src="" alt="" />
//         <input type="Phone number" />
//       </div>
//       <div className="input">
//         <img src="" alt="" />
//         <input type="Password" />
//       </div>
//       <div className="input">
//         <img src="" alt="" />
//         <input type="IMAGE??????" />
//       </div>
//       <div className="submit-container">
//         <div className="submit">Create</div>
//       </div>
//     </div>
//   );
// };

// export default Signup;
