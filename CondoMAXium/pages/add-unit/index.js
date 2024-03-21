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
  Typography
} from "@mui/material";

import { useRouter } from "next/router";
import React, { useState } from "react";
import supabase from "../../config/supabaseClient";
import styles from "../../styles/units.module.css";


const {
  data: { user },
} = await supabase.auth.getUser();

//not sure
// // Get the user's ID
// const userId = user?.id;

const AddUnitForm = () => {
  const [unitNumber, setUnitNumber] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [ownerFullName, setOwnerFullName] = useState("");
  const [occupiedBy, setOccupiedBy] = useState("");
  const [tenantFullName, setTenantFullName] = useState("");
  const [unitSize, setUnitSize] = useState("");
  const [parkingNumber, setParkingNumber] = useState("");
  const [lockerNumber, setLockerNumber] = useState("");
  const [condoFee, setCondoFee] = useState("");



  const handleAdd = async (event) => {
    event.preventDefault();

    try {
      const { data, error } = await supabase.from("units").insert([
        {
          property_name: propertyName,
          unit_number: unitNumber,
          unit_owner: ownerFullName,
          occupied_by: occupiedBy,
          size: unitSize,
          condo_fee: condoFee,
          parking_number: parkingNumber,
          locker_number: lockerNumber
        },
      ]);

      console.log("Successfully added unit: ", data);
      router.push("/units");
    } catch (error) {
      console.error("Error adding unit: ", error.message);
    }

  };


  //const [open, setOpen] = useState(false); // State for controlling dialog visibility

  const router = useRouter();

  return (
    <Box className={styles.outsideContainer}>
        <Container className={styles.unitsContainer}>
      {/* {" "} */}
      {/* Add padding top and bottom */}
      {/* <Container> */}
        <Typography variant="h4" gutterBottom className={styles.editUnitsHeader}>
          Add Unit
        </Typography>
        {/* <form onSubmit={handleAdd}> */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                name="propertyName"
                label="Property Name"
                value={propertyName}
                onChange={(event) => setPropertyName(event.target.value)}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="unitNumber"
                label="Unit Number"
                value={unitNumber}
                onChange={(event) => setUnitNumber(event.target.value)}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="ownerFullName"
                label="Owners Full Name"
                value={ownerFullName}
                onChange={(event) => setOwnerFullName(event.target.value)}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            {/* <Grid item xs={6}></Grid> */}
            <Grid item xs={6}>
              <FormControl required fullWidth style={{margingTop:"200px"}}>
                <InputLabel id="occupied-by-label">Occupied By</InputLabel>
                <Select
                  labelId="occupied-by-label"
                  id="occupied-by-select"
                  value={occupiedBy}
                  style={{margingTop:"200px"}}
                  onChange={(event) => setOccupiedBy(event.target.value)}
                >
                  <MenuItem value="Owner">Owner</MenuItem>
                  <MenuItem value="Tenant">Tenant</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {occupiedBy === "Tenant" && (
              <Grid item xs={6}>
                <TextField
                  name="tenantFullName"
                  label="Tenant Full Name"
                  value={tenantFullName}
                  onChange={(event) => setTenantFullName(event.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
              </Grid>
            )}

            <Grid item xs={6}>
              <TextField
                name="unitSize"
                label="Unit Size"
                value={unitSize}
                onChange={(event) => setUnitSize(event.target.value)}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="parkingNumber"
                label="Assigned Parking Number"
                value={parkingNumber}
                onChange={(event) => setParkingNumber(event.target.value)}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="lockerNumber"
                label="Assigned Locker Number"
                value={lockerNumber}
                onChange={(event) => setLockerNumber(event.target.value)}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="condoFee"
                label="Condo Fee"
                value={condoFee}
                onChange={(event) => setCondoFee(event.target.value)}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
          </Grid>
          <Grid container justifyContent="center" style={{ marginTop: "20px" }}>
            <Button
              variant="contained" 
              size="large"
              onClick={handleAdd}
              // onClick={() => router.push("/units")}
            >
              Save
            </Button>
          </Grid>
        {/* </form> */}
      </Container>
    </Box>
  );
};

export default AddUnitForm;
