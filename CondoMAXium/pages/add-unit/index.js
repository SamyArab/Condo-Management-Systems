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
import React, { useEffect, useState } from "react";
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
  const [condoFeeSqft, setcondoFeeSqft] = useState("");
  const [condoFeeParking, setCondoFeeParking] = useState("");
  const [propertyFky, setPropertyFky] = useState(0);
  const [ownerFky, setOwnerFky] = useState(0);
  const [tenantFky, setTenantFky] = useState(0);



  // property ID for propertFky
  useEffect(() => {
    async function fetchPropertyID() {
      try {
        const { data } = await supabase.from('properties').select('*').eq('buildingName', propertyName);
        if (data && data.length > 0) {
          const propertyId = data[0].propertyId;
          setPropertyFky(propertyId);
          console.log("Property ID:", propertyId);
        } else {
          console.log("No property found with name:", propertyName);
        }
      } catch (error) {
        console.error("Error fetching property ", error.message);
      }
    }
    if (propertyName) {
      fetchPropertyID();
    }
  }, [propertyName]);
  
  //Owner ID for ownerFky
  // useEffect(() => {
  //   async function fetchOwnerID() {
  //     try {
  //       const { data } = await supabase.from('owner').select('*').eq('', ownerFullName);
  //       if (data && data.length > 0) {
  //         const ownerId = data[0].ownerId;
  //         setOwnerFky(ownerId);
  //         console.log("Property ID:", ownerId);
  //       } else {
  //         console.log("No owner found with name:", ownerFullName);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching owner ", error.message);
  //     }
  //   }
  //   if (ownerFullName) {
  //     fetchOwnerID();
  //   }
  // }, [ownerFullName]);
  
    // For tenant fky
    // useEffect(() => {
    //   async function fetchPropertyID() {
    //     try {
    //       const { data } = await supabase.from('properties').select('*').eq('buildingName', propertyName);
    //       if (data && data.length > 0) {
    //         const propertyId = data[0].propertyId;
    //         setPropertyFky(propertyId);
    //         console.log("Property ID:", propertyId);
    //       } else {
    //         console.log("No property found with name:", propertyName);
    //       }
    //     } catch (error) {
    //       console.error("Error fetching property ", error.message);
    //     }
    //   }
    //   if (propertyName) {
    //     fetchPropertyID();
    //   }
    // }, [propertyName]);


  const handleAdd = async (event) => {
    event.preventDefault();

    try {
      const { data, error } = await supabase.from("units").insert([
        {
          property_name: propertyName,
          unit_number: unitNumber,
          //to be removed?
          unit_owner: ownerFullName,
          occupied_by: occupiedBy,
          size: unitSize,
          condo_fee_sqft: condoFeeSqft,
          parking_number: parkingNumber,
          locker_number: lockerNumber,
          condo_fee_total: ((condoFeeSqft*unitSize)+parseInt(condoFeeParking)),
          parking_fee: condoFeeParking,
          jan_fee: null,
          feb_fee: null,
          mar_fee: null,
          apr_fee: null,
          may_fee: null,
          jun_fee: null,
          jul_fee: null,
          aug_fee: null,
          sep_fee: null,
          oct_fee: null,
          nov_fee: null,
          dec_fee: null,
          //fky
          propertyFky: propertyFky,
          ownerFky: null,
          tenantFky: null
        },
      ]);

      console.log("Successfully added unit: ", data);
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
                name="condoFeeSqft"
                label="Condo Fee Per sqft"
                value={condoFeeSqft}
                onChange={(event) => setcondoFeeSqft(event.target.value)}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="condoFeeParking"
                label="Condo Fee - Parking"
                value={condoFeeParking}
                onChange={(event) => setCondoFeeParking(event.target.value)}
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
