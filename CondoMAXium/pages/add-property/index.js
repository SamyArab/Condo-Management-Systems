import React, { useState } from "react";
import { useRouter } from "next/router";
import supabase from "../../config/supabaseClient";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";

import {
  AuthChangeEvent,
  QueryResult,
  QueryData,
  QueryError,
} from "@supabase/supabase-js";

const {
  data: { user },
} = await supabase.auth.getUser();

// Get the user's ID
const userId = user?.id;

const AddPropertyForm = () => {
  const [propertyName, setPropertyName] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [unitCount, setUnitCount] = useState("");
  const [province, setProvince] = useState("");
  const [parkingCount, setParkingCount] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [lockerCount, setLockerCount] = useState("");
  const [street, setStreet] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const { data, error } = await supabase.from("properties").insert([
        {
          buildingName: propertyName,
          yearBuilt: yearBuilt,
          unitsCount: unitCount,
          province: province,
          parkingCount: parkingCount,
          postalCode: postalCode,
          lockerCount: lockerCount,
          street: street,
          profileFky: userId,
        },
      ]);

      console.log("Successfully added property: ", data);
    } catch (error) {
      console.error("Error adding property: ", error.message);
    }
    
  };

/*
const AddPropertyForm = () => {
  const [propertyInfo, setPropertyInfo] = useState({
    propertyName: "",
    yearBuilt: "",
    unitCount: "",
    province: "",
    parkingCount: "",
    postalCode: "",
    lockerCount: "",
    street: "",
  });
*/
  const [open, setOpen] = useState(false); // State for controlling dialog visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };
/*
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Property Info:", propertyInfo);
    // To  send the propertyInfo to the backend
  };
*/
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const router = useRouter();

  return (
    <div style={{ paddingTop: "140px", paddingBottom: "40px" }}>
      {" "}
      {/* Add padding top and bottom */}
      <Container>
        <Typography variant="h4" gutterBottom>
          Add Property
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                name="propertyName"
                label="Property Name"
                value={propertyName}
                onChange={(event) => setPropertyName(event.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="yearBuilt"
                label="Year Built"
                value={yearBuilt}
                onChange={(event) => setYearBuilt(event.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="unitCount"
                label="Unit Count"
                value={unitCount}
                onChange={(event) => setUnitCount(event.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="province"
                label="Province"
                value={province}
                onChange={(event) => setProvince(event.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="parkingCount"
                label="Parking Count"
                value={parkingCount}
                onChange={(event) => setParkingCount(event.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="postalCode"
                label="Postal Code"
                value={postalCode}
                onChange={(event) => setPostalCode(event.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="lockerCount"
                label="Locker Count"
                value={lockerCount}
                onChange={(event) => setLockerCount(event.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="street"
                label="Street"
                value={street}
                onChange={(event) => setStreet(event.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
          <Grid container justifyContent="center" style={{ marginTop: "20px" }}>
            <Button
              type="submit"
              variant="contained"
              color="inherit"
              onClick={() => router.push("/profile")}
            >
              Register Property
            </Button>
          </Grid>
        </form>
      </Container>
      {/* Dialog for confirmation */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Would you like to check the Unit as well?</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Yes
          </Button>
          <Button onClick={handleClose} color="secondary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddPropertyForm;
