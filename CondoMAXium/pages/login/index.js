import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import supabase from "../../config/supabaseClient";
import { useRouter } from "next/router";

//MUI IMPORTS
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignInSide() {
  // Ricky: Added login validation with supabase (redirects to profile if valid, alert if not)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        throw error;
      }
      console.log("User logged in succesfully:", data);
      // routeChange();
      () => router.push("/profile");
    } catch (error) {
      // Old code from before
      //   const data = new FormData(event.currentTarget);
      //   console.log({
      //     email: data.get("email"),
      //     password: data.get("password"),
      //   });
      console.error("Error logging in:", error.message);
      alert(error);
    }
  };

  //!!!!!!!!!!! find another way to change pages
  // let navigate = useNavigate();
  // const routeChange = () => {
  //   let path = "/profile";
  //   navigate(path);
  // };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={() => router.push("/profile")}
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/signup" variant="body2">
                    Don&apos;t have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

//console.log(supabase);

// const Login = () => {
//   return (
//     <div className="container">
//       <div className="header">
//         <div className="text">CondoMAXium - Don't Settle For Less</div>
//         <h2>Condo Management Solutions</h2>
//       </div>
//       <div className="input">
//         <img src="" alt="" />
//         <input type="email" />
//       </div>
//       <div className="input">
//         <img src="" alt="" />
//         <input type="password" />
//       </div>
//       <div className="submit-container">
//         <div className="submit">Login</div>
//         {/* <Link href="./signup.tsx" className="submit">
//           Create New Account
//         </Link> */}
//       </div>
//     </div>
//   );
// };

// export default Login;
