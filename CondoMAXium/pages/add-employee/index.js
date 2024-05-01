import {
  Button,
  Container,
  Grid,
  Box,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormControl,
  Typography,
  InputAdornment,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import supabase from "../../config/supabaseClient";
import styles from "../../styles/units.module.css";
import { v4 as uuidv4 } from "uuid";
import Head from "next/head";

const {
  data: { user },
} = await supabase.auth.getUser();

const AddEmployeeForm = () => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [position, setPosition] = useState("");

  // Method to handle position selection
  const handlePositionChange = (event) => {
    setPosition(event.target.value);
  };

  //handle method for phone number
  const handlePhoneChange = (event) => {
    // Format the phone number as the user types
    const formattedPhoneNumber = formatPhoneNumber(event.target.value);
    setPhoneNumber(formattedPhoneNumber);
  };

  //correct formatting for phone number
  const formatPhoneNumber = (input) => {
    // Remove non-numeric characters
    const numericInput = input.replace(/\D/g, "");

    // Apply the desired pattern (XXX-XXX-XXXX)
    const formattedPhoneNumber = numericInput.replace(
      /(\d{3})(\d{3})(\d{4})/,
      "$1-$2-$3"
    );

    return formattedPhoneNumber;
  };

  const handleAdd = async (event) => {
    event.preventDefault();

    try {
      // Check if the email already exists
      const { data: existingEmployee, error: checkError } = await supabase
        .from("employees")
        .select("email")
        .eq("email", email)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingEmployee) {
        alert("An employee with this email already exists.");
        return;
      }

      // Insert new employee
      const { data: employeeData, error: insertError } = await supabase
        .from("employees")
        .insert([
          {
            first_name: first_name,
            last_name: last_name,
            email: email,
            position: position, // Ensure this matches the enum values in the database
            phone_number: phone_number,
          },
        ]);

      if (insertError) throw insertError;

      console.log("Successfully added employee: ", employeeData);
      alert("Employee added successfully!");
      router.push("/manage-employees");
    } catch (error) {
      console.error("Error in operation: ", error.message);
      alert("Failed to add employee: " + error.message);
    }
  };

  const router = useRouter();

  return (
    <>
      <Head>
        <script
          id="sc-script"
          src="https://cdn.smartcat-proxy.com/60a29c2d1d4341e38fbb9d3f4a3bef3d/script-v1/__translator.js?hash=7e6e37c59d0bf7e0a6f687b25f488757"
        />
      </Head>
      <Box className={styles.outsideContainer}>
        <Container className={styles.unitsContainer}>
          <Typography
            variant="h4"
            gutterBottom
            className={styles.editUnitsHeader}
          >
            Add Employee
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ textDecoration: "underline" }}
            display="inline"
            style={{ color: "#333", padding: "2%" }}
          >
            User Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                name="first_name"
                label="First Name"
                value={first_name}
                onChange={(event) => setFirstName(event.target.value)}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="last_name"
                label="Last Name"
                value={last_name}
                onChange={(event) => setLastName(event.target.value)}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="email"
                label="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="phone_number"
                label="Phone Number"
                value={phone_number}
                onChange={handlePhoneChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="position-select-label">Position</InputLabel>
                <Select
                  labelId="position-select-label"
                  id="position-select"
                  value={position}
                  label="Position"
                  onChange={handlePositionChange}
                >
                  <MenuItem value="financial">Financial Analyst</MenuItem>
                  <MenuItem value="daily_op">Daily Operations Analyst</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <br />
          <br />
          <Grid container justifyContent="center" style={{ marginTop: "20px" }}>
            <Button variant="contained" size="large" onClick={handleAdd}>
              Save
            </Button>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default AddEmployeeForm;
