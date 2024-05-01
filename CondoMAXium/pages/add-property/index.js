import React, { useState, useEffect } from "react";
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
  AppBar, 
  Toolbar, 
  Badge, 
  IconButton
} from "@mui/material";
import Head from "next/head";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const AddPropertyForm = () => {
  const [propertyName, setPropertyName] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [unitCount, setUnitCount] = useState("");
  const [province, setProvince] = useState("");
  const [parkingCount, setParkingCount] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [lockerCount, setLockerCount] = useState("");
  const [street, setStreet] = useState("");
  const [userId, setUserId] = useState(null); // State to store user ID
  const [open, setOpen] = useState(false); // State for controlling dialog visibility

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data && data.user) {
        setUserId(data.user.id);
      }
    };

    fetchData();
  }, []);

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
      console.error("Error adding property:", error.message);
    }
  };

  /* cannot use since dont call handleOpen anymore */

  // const handleOpen = () => {
  //   setOpen(true);
  // };
  //
  // const handleClose = () => {
  //   setOpen(false);
  // };

  const router = useRouter();

  return (
    <>
      <Head>
        <script
          id="sc-script"
          src="https://cdn.smartcat-proxy.com/60a29c2d1d4341e38fbb9d3f4a3bef3d/script-v1/__translator.js?hash=7e6e37c59d0bf7e0a6f687b25f488757"
        />
      </Head>
      <AppBar position="absolute" >
            <Toolbar sx={{ pr: "24px" }}>
              {/* <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                // onClick={toggleDrawer}
                sx={{
                  marginRight: "36px",
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton> */}
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                CondoMAXium
              </Typography>
              <Typography
                component="h2"
                variant="h6"
                color="inherit"
                noWrap
                onClick={() => router.push("/dashboardCMC")}
                // sx={{ flexGrow: 1 }}
              >
                Dashboard
              </Typography>
              <IconButton color="inherit">
                <Badge color="secondary">
                  <NotificationsIcon  onClick={() => router.push("/notifications-cmc")}/>
                </Badge>
              </IconButton>
              <IconButton aria-label="profile" color="inherit" onClick={() => router.push("/profile")}>
                <AccountCircleIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
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
            <Grid
              container
              justifyContent="center"
              style={{ marginTop: "20px" }}
            >
              <Button
                type="submit"
                variant="contained"
                color="inherit"
                onClick={() => router.push("/dashboardCMC")} //where is onClick={handleOpen}
              >
                Register Property
              </Button>
            </Grid>
          </form>
        </Container>
        {/* Dialog for confirmation */}
        {/*<Dialog open={open} onClose={handleClose}>*/}
        {/*  <DialogTitle>Would you like to check the Unit as well?</DialogTitle>*/}
        {/*  <DialogActions>*/}
        {/*    <Button onClick={handleClose} color="primary">*/}
        {/*      Yes*/}
        {/*    </Button>*/}
        {/*    <Button onClick={handleClose} color="secondary">*/}
        {/*      No*/}
        {/*    </Button>*/}
        {/*  </DialogActions>*/}
        {/*</Dialog>*/}
      </div>
    </>
  );
};

export default AddPropertyForm;
