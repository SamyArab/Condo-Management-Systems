import React from "react";
import supabase from "../../config/supabaseClient";
import { useState } from "react";

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

// Mark's new code, seems to be working
const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Ricky: Added these variables to add to the user
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        // Added additional info to sign up
        options: {
          data: {
            first_name: first_name,
            last_name: last_name,
          },
        },
      });

      if (error?.status === 429) {
        alert("Error signing up: Email rate limit exceeded");
        throw error;
      }

      console.log("User signed up successfully:", data);
      <Link href="/"></Link>;
      // routeChange();
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  // const routeChange = () => {
  //   let path = "/profile";
  //   console.log("Navigating to:", path);
  //   // Implement navigation logic here
  // };

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
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  value={first_name}
                  onChange={(event) => setFirstName(event.target.value)}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={last_name}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </Grid>
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
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Grid>
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
              onClick={() => router.push("/profile")}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
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
        {/* <Copyright sx={{ mt: 5 }} /> */}
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
