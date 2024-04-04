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
  InputAdornment
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import supabase from "../../config/supabaseClient";
import styles from "../../styles/units.module.css";
import {v4 as uuidv4} from 'uuid';


const {
  data: { user },
} = await supabase.auth.getUser();

//not sure
// // Get the user's ID
// const userId = user?.id;

const AddUnitForm = () => {
  const [unitNumber, setUnitNumber] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [ownerFirstName, setOwnerFirstName] = useState("");
  const [ownerLastName, setOwnerLastName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [occupiedBy, setOccupiedBy] = useState("");
  const [tenantFirstName, setTenantFirstName] = useState("");
  const [tenantLastName, setTenantLastName] = useState("");
  const [tenantEmail, setTenantEmail] = useState("");
  const [tenantPhone, setTenantPhone] = useState("");
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

  const handleSizeChange = (value) => {
    // Regular expression to remove any non-numeric characters from the input
    const numericValue = value.replace(/\D/g, '');
    setUnitSize(numericValue);
  };


//handle method for owner phone number
const handleOwnerPhoneChange = (event) => {
  // Format the phone number as the user types
  const formattedPhoneNumber = formatPhoneNumber(event.target.value);
  setOwnerPhone(formattedPhoneNumber);
};

//handle method for owner phone number
const handleTenantPhoneChange = (event) => {
  // Format the phone number as the user types
  const formattedPhoneNumber = formatPhoneNumber(event.target.value);
  setTenantPhone(formattedPhoneNumber);
};

//correct formatting for phone number
const formatPhoneNumber = (input) => {
  // Remove non-numeric characters
  const numericInput = input.replace(/\D/g, '');
  
  // Apply the desired pattern (XXX-XXX-XXXX)
  const formattedPhoneNumber = numericInput.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');

  return formattedPhoneNumber;
};

const handleAdd = async (event) => {
  event.preventDefault();

  try {
    // Insert data into the "units" table
    const { data: unitData, error: unitError } = await supabase.from("units").insert([
      {
        property_name: propertyName,
        unit_number: unitNumber,
        unit_owner: null,
        occupied_by: occupiedBy,
        size: unitSize,
        condo_fee_sqft: condoFeeSqft,
        parking_number: parkingNumber,
        locker_number: lockerNumber,
        condo_fee_total: ((condoFeeSqft*unitSize)+parseInt(condoFeeParking)),
        parking_fee: condoFeeParking,
        emailUnit: ownerEmail,
        first_name_owner: ownerFirstName,
        last_name_owner: ownerLastName,
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
        tenantFky: null
      },
    ]);
    console.log("Successfully added unit: ", unitData);
    router.push("/units");
  } catch (error) {
    console.error("Error adding data: ", error.message);
  }

  ///////////////////////////////////////////

  // Check if the email already exists in the "units" table
  const { data: units, error: unitsError } = await supabase
    .from('units')
    .select('emailUnit')
    .eq('emailUnit', ownerEmail);

  if (unitsError) {
    console.error("Error fetching units:", unitsError.message);
    return;
  }

  if (units.length > 1) {
    console.error("Email already exists in the units table");
    return;
  }

  // If the email doesn't exist in the "units" table, send the OTP
  const { data, error } = await supabase.auth.signInWithOtp({
    email: ownerEmail,
    options: {
      shouldCreateUser: true,
    },
  });
  if (error) {
    console.error("Error signing up:", error.message);
  } else {
    alert('OTP has been sent to your email');
  }

  // Check profile
  const { data: existingProfile, error: profileerror } = await supabase
  .from('profiles')
  .select('*')
  .eq('emailProfile', ownerEmail)
  .single();

if (existingProfile) {
  console.error('Error fetching existing profile:', profileerror);
} else if (!existingProfile) {
  const { data: newProfile, error: insertError } = await supabase
    .from('profiles')
    .insert([
      { first_name: ownerFirstName, last_name: ownerLastName, emailProfile: ownerEmail, id: uuidv4() }
    ]);

  if (insertError) {
    console.error('Error inserting new profile:', insertError);
  } else {
    console.log('Inserted new profile:', newProfile);
  }
} else {
  console.log('Profile with this email already exists:', existingProfile);
}
};



  //const [open, setOpen] = useState(false); // State for controlling dialog visibility

  const router = useRouter();

  return (
    <Box className={styles.outsideContainer}>
        <Container className={styles.unitsContainer}>

        <Typography variant="h4" gutterBottom className={styles.editUnitsHeader}>
          Add Unit
        </Typography>
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{textDecoration: 'underline'}} 
          display="inline" 
          style={{ color:"#333", padding: "2%" }}
          >
          Owner Information
        </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                name="ownerFirtsName"
                label="Owners First Name"
                value={ownerFirstName}
                onChange={(event) => setOwnerFirstName(event.target.value)}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="ownerLastName"
                label="Owners Last Name"
                value={ownerLastName}
                onChange={(event) => setOwnerLastName(event.target.value)}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="ownerEmail"
                label="Owners Email"
                value={ownerEmail}
                onChange={(event) => setOwnerEmail(event.target.value)}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="ownerPhone"
                label="Owners Phone"
                value={ownerPhone}
                onChange={handleOwnerPhoneChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
          </Grid>
          <br/>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{textDecoration: 'underline'}} 
            display="inline" 
            style={{ color:"#333", padding: "2%" }}
            >
            Unit Information
          </Typography>
          <br/>
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
                required
                name='unitSize'
                type='text'
                label='Size'
                value={unitSize}
                onChange={(event) => handleSizeChange(event.target.value)}
                InputProps={{ 
                    startAdornment: <InputAdornment position="start">sqft</InputAdornment>,
                    inputMode: 'numeric',
                    pattern: '[0-9]*', //Allow only numeric numbers
                }}
                margin="normal"
                fullWidth
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
                label="Condo Fee Per sqft (monthly)"
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
                label="Condo Fee - Parking (monthly)"
                value={condoFeeParking}
                onChange={(event) => setCondoFeeParking(event.target.value)}
                fullWidth
                margin="normal"
                required
              />
            </Grid>



            <Grid item xs={6}>
              <FormControl required fullWidth margin="normal">
                <InputLabel>Occupied By</InputLabel>
                <Select
                  variant="outlined"
                  labelId="occupied-by-label"
                  id="occupied-by-select"
                  label="Occupied By"
                  value={occupiedBy}
                  // margin="normal"
                  // style={{margingTop:"200px"}}
                  onChange={(event) => setOccupiedBy(event.target.value)}
                >
                  <MenuItem value="Owner">Owner</MenuItem>
                  <MenuItem value="Tenant">Tenant</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {occupiedBy === "Tenant" && (
              <Grid container spacing={2} 
                style={{margin: "0.2%"}}
                >
                <Grid item xs={6}>
                  <TextField
                    name="tenantFirstName"
                    label="Tenants First Name"
                    value={tenantFirstName}
                    onChange={(event) => setTenantFirstName(event.target.value)}
                    fullWidth
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="tenantLastName"
                    label="Tenants Last Name"
                    value={tenantLastName}
                    onChange={(event) => setTenantLastName(event.target.value)}
                    fullWidth
                    margin="normal"
                    required
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    name="tenantEmail"
                    label="Tenants Email"
                    value={tenantEmail}
                    onChange={(event) => setTenantEmail(event.target.value)}
                    fullWidth
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="tenantPhone"
                    label="Tenants Phone"
                    value={tenantPhone}
                    onChange={handleTenantPhoneChange}
                    fullWidth
                    margin="normal"
                    required
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid container justifyContent="center" style={{ marginTop: "20px" }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleAdd}
            >
              Save
            </Button>
          </Grid>
      </Container>
    </Box>
  );
};

export default AddUnitForm;
