import React from "react";
// import { Navigate, useNavigate } from "react-router-dom";
import {
  AuthChangeEvent,
  QueryResult,
  QueryData,
  QueryError,
} from "@supabase/supabase-js";
import supabase from "../../config/supabaseClient";
import { useState, useEffect } from "react";
import Header from "../../components/layout/Header";
import { useRouter } from "next/router";
import Head from "next/head";

import {
  Typography,
  Container,
  Box,
  Avatar,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import styles from "../../styles/profile.module.css";

const {
  data: { user },
} = await supabase.auth.getUser();

// Get the user's ID
const userEmail = user?.email;
// Fetch data from your_table where the user_id matches the current user's ID
const { data, error } = await supabase
  .from("profiles")
  .select("*")
  .eq("emailProfile", userEmail);

if (error) {
  console.error("Error: ", error);
} else {
  console.log("Data: ", data);
}

const userObject = {
  name: data?.[0]?.first_name.concat(" ", data?.[0]?.last_name),
  email: user?.email,
  sex: "Male",
  phone: "438-886-9196",
  properties: [
    { name: "Property 1", available: true },
    { name: "Property 2", available: false },
    { name: "Property 3", available: true },
    { name: "Property 4", available: false },
    { name: "Property 5", available: true },
    { name: "Property 6", available: false },
    { name: "Property 7", available: true },
    { name: "Property 8", available: false },
    { name: "Property 9", available: false },
  ],
  payments: [{ outstandingCharges: 100 }],
};

const ProfilePage = () => {
  // let navigate = useNavigate();
  const handlePay = (paymentIndex) => {
    console.log(`Processing payment for payment index ${paymentIndex}...`);
  };

  // const routeChange = () => {
  //   let path = "/";
  //   navigate(path);
  // };

  const router = useRouter();

  return (
    <>
      <Head>
        <script
          id="sc-script"
          src="https://cdn.smartcat-proxy.com/60a29c2d1d4341e38fbb9d3f4a3bef3d/script-v1/__translator.js?hash=7e6e37c59d0bf7e0a6f687b25f488757"
        ></script>
      </Head>
      <Header></Header>
      <Box className={styles.outerContainer}>
        <Container className={styles.profileContainer} maxWidth="sm">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box className={styles.profileBox}>
                <Avatar
                  alt={userObject.name}
                  src=""
                  sx={{ width: 95, height: 95, margin: "0 auto" }}
                />
                <Typography
                  variant="h4"
                  component="h1"
                  className={styles.profileHeader}
                  gutterBottom
                >
                  {userObject.name}
                </Typography>
                <Typography className={styles.profileDetails} gutterBottom>
                  <strong>My Profile</strong>
                </Typography>
                <Box className={styles.profileDetails}>
                  <Typography variant="h6">
                    <strong>Sex: {userObject.sex}</strong>
                  </Typography>
                  <Typography variant="h6">
                    <strong>{userObject.email}</strong>
                  </Typography>
                  <Typography variant="h6">
                    <strong>{userObject.phone}</strong>
                  </Typography>
                </Box>
                <Box className={styles.logoutButtonContainer}>
                  <Button
                    className={styles.button}
                    variant="contained"
                    color="error"
                    onClick={async function signOutUser() {
                      router.push("/");
                      const { error } = await supabase.auth.signOut();
                      if (error) {
                        console.error("Error signing out:", error.message);
                      } else {
                        console.log("User signed out successfully");
                        // Clearing local storage and session storage
                        localStorage.clear();
                        sessionStorage.clear();
                      }
                      console.log(supabase.auth.getUser());
                    }}
                  >
                    Logout
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} className={styles.secondGrid}>
              <Box className={styles.propertiesBox}>
                <Typography className={styles.propertiesTitle} gutterBottom>
                  Properties
                </Typography>
                <div className={styles.propertiesDiv}>
                  {userObject.properties.map((property, index) => (
                    <Typography key={index} variant="body1">
                      {property.name} -{" "}
                      <span
                        style={{
                          color: property.available
                            ? "rgb(24,118,209)"
                            : "rgb(211,47,47)",
                        }}
                      >
                        {property.available ? "Available" : "Rented"}
                      </span>
                    </Typography>
                  ))}
                </div>
              </Box>
              <Box className={styles.keyBox}>
                <Typography className={styles.keyTitle} gutterBottom>
                  Keys
                </Typography>
                <TextField
                  label="Enter Keys"
                  fullWidth
                  InputProps={{ style: { height: "50px" } }}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box className={styles.paymentBox}>
                <Typography className={styles.paymentTitle} gutterBottom>
                  Payments
                </Typography>
                <TableContainer>
                  <Table className={styles.paymentTable}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Outstanding Charges</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userObject.payments.map((payment, index) => (
                        <TableRow key={index}>
                          <TableCell>${payment.outstandingCharges}</TableCell>
                          <TableCell>
                            <Button
                              className={styles.button}
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                handlePay(index);
                                console.log(supabase.auth.getUser());
                              }}
                            >
                              Pay
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* <TableContainer>
                  <Table className="payment-table"></Table>
                </TableContainer> */}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box className={styles.paymentBox}>
                <Typography className={styles.paymentTitle} gutterBottom>
                  Features
                </Typography>
                <TableContainer>
                  <Table className={styles.paymentTable}>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Button
                            className={styles.button}
                            variant="contained"
                            color="primary"
                            onClick={() => router.push("/units")}
                          >
                            Units
                          </Button>
                        </TableCell>

                        <TableCell>
                          <Button
                            className={styles.button}
                            variant="contained"
                            color="primary"
                            onClick={() => router.push("/dashboard")}
                          >
                            Dashboard
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            className={styles.button}
                            variant="contained"
                            color="primary"
                            onClick={() => router.push("/reservation")}
                          >
                            Reservations
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* <TableContainer>
                  <Table className="payment-table"></Table>
                </TableContainer> */}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default ProfilePage;
