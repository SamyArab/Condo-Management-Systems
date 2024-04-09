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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
  const [propertyName, setPropertyName] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [ownerFirstName, setOwnerFirstName] = useState("");
  const [ownerLastName, setOwnerLastName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [tenantFirstName, setTenantFirstName] = useState("");
  const [tenantLastName, setTenantLastName] = useState("");
  const [tenantEmail, setTenantEmail] = useState("");
  const [tenantPhone, setTenantPhone] = useState("");
  const [occupiedBy, setOccupiedBy] = useState("");
  const [unitSize, setUnitSize] = useState("");
  const [condoFeeSqft, setcondoFeeSqft] = useState("");
  const [condoFeeParking, setCondoFeeParking] = useState("");
  const [parkingNumber, setParkingNumber] = useState("");
  const [lockerNumber, setLockerNumber] = useState("");
  const [propertyFky, setPropertyFky] = useState(0);
  // const [ownerFky, setOwnerFky] = useState(0);
  // const [tenantFky, setTenantFky] = useState(0);

  const [isIncompleteForm, setIsIncompleteForm] = useState(false);


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

  //handle method for size input to only accept numbers
  const handleSizeChange = (value) => {
    // Regular expression to remove any non-numeric characters from the input
    const numericValue = value.replace(/\D/g, '');
    setUnitSize(numericValue);
  };
  //handle method for condo fee sqft input to only accept numbers
  const handleCondoFeeSQFTChange = (value) => {
    // Regular expression to remove any non-numeric characters from the input
    const numericValue = value.replace(/\D/g, '');
    setcondoFeeSqft(numericValue);
  };

  //handle method for parking fee input to only accept numbers
  const handleParkingFeeChange = (value) => {
    // Regular expression to remove any non-numeric characters from the input
    const numericValue = value.replace(/\D/g, '');
    setCondoFeeParking(numericValue);
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

    // If the unit is occupied by the owner, clear tenant information
    if (occupiedBy === "Owner") {
      setTenantFirstName("");
      setTenantLastName("");
      setTenantEmail("");
      setTenantPhone("");
    }

    // Initialize an array with fields that are always required
    let requiredFields = [
      propertyName, 
      unitNumber, 
      ownerFirstName, 
      ownerLastName, 
      ownerEmail, 
      ownerPhone, 
      occupiedBy, 
      unitSize, 
      condoFeeSqft, 
      condoFeeParking, 
      parkingNumber, 
      lockerNumber
    ];

    // If the unit is occupied by a tenant, add tenant information fields to the validation list
    if (occupiedBy === "Tenant") {
      requiredFields = requiredFields.concat([tenantFirstName, tenantLastName, tenantEmail, tenantPhone]);
    }

    // Check if all required fields are filled
    const isFormComplete = requiredFields.every(field => field && field.trim() !== '');

    if (!isFormComplete) {
      setIsIncompleteForm(true);
      return;
    }

    try {
      // Insert data into the "units" table
      const { data: unitData, error: unitError } = await supabase
      .from("units")
      .insert([
        {
          property_name: propertyName,
          unit_number: unitNumber,
          first_name_owner: ownerFirstName,
          last_name_owner: ownerLastName,
          emailUnit: ownerEmail,
          owner_phone: ownerPhone,
          first_name_tenant: occupiedBy === "Owner" ? "" : tenantFirstName,  // Clear if owner
          last_name_tenant: occupiedBy === "Owner" ? "" : tenantLastName,    // Clear if owner
          tenant_email: occupiedBy === "Owner" ? "" : tenantEmail,           // Clear if owner
          tenant_phone: occupiedBy === "Owner" ? "" : tenantPhone,           // Clear if owner
          occupied_by: occupiedBy,
          size: unitSize,
          condo_fee_sqft: condoFeeSqft,
          parking_fee: condoFeeParking,
          condo_fee_total: ((condoFeeSqft * unitSize) + parseInt(condoFeeParking, 10)),
          parking_number: parkingNumber,
          locker_number: lockerNumber,
          jan_fee: false,
          feb_fee: false,
          mar_fee: false,
          apr_fee: false,
          may_fee: false,
          jun_fee: false,
          jul_fee: false,
          aug_fee: false,
          sep_fee: false,
          oct_fee: false,
          nov_fee: false,
          dec_fee: false,
          //fky
          propertyFky: propertyFky,
          // picture: null
          // tenantFky: null
        }
      ]);

      if (unitError) {
        console.error("Insertion error: ", unitError);
        return;
      }

      console.log("Successfully added unit: ", unitData);
      router.push("/units");

    } //end of try {}
    catch (error) {
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
  }; // end of handleAdd

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
                inputProps={{ 
                  maxLength: 10,
                  pattern: "[0-9]*"
                }}
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
                onChange={(event) => handleCondoFeeSQFTChange(event.target.value)}
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
                onChange={(event) => handleParkingFeeChange(event.target.value)}
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
                    inputProps={{ 
                      maxLength: 10,
                      pattern: "[0-9]*"
                    }}
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
            {isIncompleteForm && (
              <Dialog
                open={isIncompleteForm}
                onClose={() => setIsIncompleteForm(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{"Incomplete Form"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Please fill out all required fields before saving.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setIsIncompleteForm(false)} color="primary" autoFocus>
                    Okay
                  </Button>
                </DialogActions>
              </Dialog>
            )}
          </Grid>
      </Container>
    </Box>
  );
};

export default AddUnitForm;
