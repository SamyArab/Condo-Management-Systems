import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
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
import "../../styles/profile.module.css";

const {
  data: { user },
} = await supabase.auth.getUser();

// Get the user's ID
const userId = user?.id;

// Fetch data from your_table where the user_id matches the current user's ID
const { data, error } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", userId);

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
      <Header></Header>
      <Box className="outer-container">
        <Container className="profile-container" maxWidth="sm">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box className="profile-box">
                <Avatar
                  alt={userObject.name}
                  src=""
                  sx={{ width: 95, height: 95, margin: "0 auto" }}
                />
                <Typography
                  variant="h4"
                  component="h1"
                  className="profile-header"
                  gutterBottom
                >
                  {userObject.name}
                </Typography>
                <Typography className="profile-details" gutterBottom>
                  <strong>My Profile</strong>
                </Typography>
                <Box className="profile-details">
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
                <Box className="logout-button-container">
                  <Button
                    className="button"
                    variant="contained"
                    color="error"
                    onClick={async function signOutUser() {
                      router.push("/dashboard");
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

            <Grid item xs={12} sm={6} className="second-grid">
              <Box className="properties-box">
                <Typography className="properties-title" gutterBottom>
                  Properties
                </Typography>
                <div className="properties-div">
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
              <Box className="key-box">
                <Typography className="key-title" gutterBottom>
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
              <Box className="payment-box">
                <Typography className="payment-title" gutterBottom>
                  Payments
                </Typography>
                <TableContainer>
                  <Table className="payment-table">
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
                              className="button"
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
              <Box className="payment-box">
                <Typography className="payment-title" gutterBottom>
                  Features
                </Typography>
                <TableContainer>
                  <Table className="payment-table">
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Button
                            className="button"
                            variant="contained"
                            color="primary"
                            onClick={() => router.push("/units")}
                          >
                            Units
                          </Button>
                        </TableCell>

                        <TableCell>
                          <Button
                            className="button"
                            variant="contained"
                            color="primary"
                            onClick={() => router.push("/dashboard")}
                          >
                            Dashboard
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            className="button"
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
