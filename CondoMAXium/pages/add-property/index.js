import React, { useState } from "react";
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

  const [open, setOpen] = useState(false); // State for controlling dialog visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Property Info:", propertyInfo);
    // To  send the propertyInfo to the backend
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
                value={propertyInfo.propertyName}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="yearBuilt"
                label="Year Built"
                value={propertyInfo.yearBuilt}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="unitCount"
                label="Unit Count"
                value={propertyInfo.unitCount}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="province"
                label="Province"
                value={propertyInfo.province}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="parkingCount"
                label="Parking Count"
                value={propertyInfo.parkingCount}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="postalCode"
                label="Postal Code"
                value={propertyInfo.postalCode}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="lockerCount"
                label="Locker Count"
                value={propertyInfo.lockerCount}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="street"
                label="Street"
                value={propertyInfo.street}
                onChange={handleChange}
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
              onClick={handleOpen}
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
