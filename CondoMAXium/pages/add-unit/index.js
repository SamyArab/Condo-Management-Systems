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
import { v4 as uuidv4 } from "uuid";

import Head from "next/head";

// const {
//   data: { user },
// } = await supabase.auth.getUser();

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

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  // property ID for propertFky
  useEffect(() => {
    async function fetchPropertyID() {
      try {
        const { data } = await supabase
          .from("properties")
          .select("*")
          .eq("buildingName", propertyName);
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
    const numericValue = value.replace(/\D/g, "");
    setUnitSize(numericValue);
  };

  //handle method for condo fee sqft input to only accept numbers
  const handleCondoFeeSQFTChange = (value) => {
    // Regular expression to remove any non-numeric characters except decimal points from the input
    const numericValue = value.replace(/[^\d.]/g, "");

    // You might also want to handle cases where there are multiple decimal points
    // This part ensures there's only one decimal point in the number
    const parts = numericValue.split(".");
    let decimalValue;
    if (parts.length > 2) {
      // Join the first part with the second part, discarding additional decimal points
      decimalValue = parts[0] + "." + parts.slice(1).join("");
    } else {
      decimalValue = numericValue;
    }

    setcondoFeeSqft(decimalValue);
  };

  //handle method for parking fee input to only accept numbers
  const handleParkingFeeChange = (value) => {
    // Regular expression to remove any non-numeric characters from the input
    const numericValue = value.replace(/[^\d.]/g, "");

    // You might also want to handle cases where there are multiple decimal points
    // This part ensures there's only one decimal point in the number
    const parts = numericValue.split(".");
    let decimalValue;
    if (parts.length > 2) {
      // Join the first part with the second part, discarding additional decimal points
      decimalValue = parts[0] + "." + parts.slice(1).join("");
    } else {
      decimalValue = numericValue;
    }

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
      lockerNumber,
    ];

    // If the unit is occupied by a tenant, add tenant information fields to the validation list
    if (occupiedBy === "Tenant") {
      requiredFields = requiredFields.concat([
        tenantFirstName,
        tenantLastName,
        tenantEmail,
        tenantPhone,
      ]);
    }

    // Check if all required fields are filled
    const isFormComplete = requiredFields.every(
      (field) => field && field.trim() !== ""
    );

    if (!isFormComplete) {
      setIsIncompleteForm(true);
      return;
    }

    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth(); // getMonth() returns 0-11 for Jan-Dec
      const currentDay = currentDate.getDate();

      // Initialize the monthly fees object with false values
      const monthlyFees = {
        jan_fee__: false,
        feb_fee__: false,
        mar_fee__: false,
        apr_fee__: false,
        may_fee__: false,
        jun_fee__: false,
        jul_fee__: false,
        aug_fee__: false,
        sep_fee__: false,
        oct_fee__: false,
        nov_fee__: false,
        dec_fee__: false,
      };

      // Update the values based on the current date
      Object.keys(monthlyFees).forEach((key, index) => {
        if (index < currentMonth) {
          monthlyFees[key] = null; // Past months get null
        } else if (index > currentMonth) {
          monthlyFees[key] = false; // Future months get false
        } else if (index === currentMonth) {
          // For the current month, check the day
          monthlyFees[key] = currentDay <= 15 ? false : null;
        }
      });

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
            first_name_tenant: occupiedBy === "Owner" ? "" : tenantFirstName, // Clear if owner
            last_name_tenant: occupiedBy === "Owner" ? "" : tenantLastName, // Clear if owner
            tenant_email: occupiedBy === "Owner" ? "" : tenantEmail, // Clear if owner
            tenant_phone: occupiedBy === "Owner" ? "" : tenantPhone, // Clear if owner
            occupied_by: occupiedBy,
            size: unitSize,
            condo_fee_sqft: condoFeeSqft,
            parking_fee: condoFeeParking,
            condo_fee_total:
              condoFeeSqft * unitSize + parseFloat(condoFeeParking, 10),
            parking_number: parkingNumber,
            locker_number: lockerNumber,
            jan_fee__: monthlyFees.jan_fee__,
            feb_fee__: monthlyFees.feb_fee__,
            mar_fee__: monthlyFees.mar_fee__,
            apr_fee__: monthlyFees.apr_fee__,
            may_fee__: monthlyFees.may_fee__,
            jun_fee__: monthlyFees.jun_fee__,
            jul_fee__: monthlyFees.jul_fee__,
            aug_fee__: monthlyFees.aug_fee__,
            sep_fee__: monthlyFees.sep_fee__,
            oct_fee__: monthlyFees.oct_fee__,
            nov_fee__: monthlyFees.nov_fee__,
            dec_fee__: monthlyFees.dec_fee__,
            //fky
            propertyFky: propertyFky,
            // picture: null
            // tenantFky: null
          },
        ]);

      if (unitError) {
        console.error("Insertion error: ", unitError);
        return;
      }

      console.log("Successfully added unit: ", unitData);
      router.push("/units");
    } catch (error) {
      //end of try {}
      console.error("Error adding data: ", error.message);
    }

    ///////////////////////////////////////////

    // Check if the owner email already exists in the "units" table
    const { data: unitsOwner, error: unitsErrorOwner } = await supabase
      .from("units")
      .select("emailUnit")
      .eq("emailUnit", ownerEmail);

    if (unitsErrorOwner) {
      console.error("Error fetching units for owner:", unitsErrorOwner.message);
      return;
    }

    if (unitsOwner.length > 1) {
      console.error("Email already exists in the units table for owner");
      return;
    }

    // If the email doesn't exist in the "units" table, send the OTP
    const { dataO, errorO } = await supabase.auth.signInWithOtp({
      email: ownerEmail,
      options: {
        shouldCreateUser: true,
      },
    });
    if (errorO) {
      console.error("Error signing up:", errorO.message);
    } else {
      alert("OTP has been sent to your email");
    }

    // Check profile for owner
    const {
      data: existingProfileOwner,
      error: profileErrorOwner,
    } = await supabase
      .from("profiles")
      .select("*")
      .eq("emailProfile", ownerEmail)
      .single();

    if (existingProfileOwner) {
      console.error("Error fetching existing profile:", profileErrorOwner);
    } else if (!existingProfileOwner) {
      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert([
          {
            first_name: ownerFirstName,
            last_name: ownerLastName,
            roleOfUser: "owner",
            emailProfile: ownerEmail,
            id: uuidv4(),
          },
        ]);

      if (insertError) {
        console.error("Error inserting new profile for owner:", insertError);
      } else {
        console.log("Inserted new profile for owner:", newProfile);
      }
    } else {
      console.log(
        "Profile with this email already exists:",
        existingProfileOwner
      );
    }

    if (occupiedBy === "Tenant") {
      // Check if the tenant email already exists in the "units" table
      const {
        data: unitsTenant,
        error: unitsErrorTenant,
      } = await supabase
        .from("units")
        .select("tenant_email")
        .eq("tenant_email", tenantEmail);

      if (unitsErrorTenant) {
        console.error(
          "Error fetching units for tenant:",
          unitsErrorTenant.message
        );
        return;
      }

      if (unitsTenant.length > 1) {
        console.error("Email already exists in the units table for tenant");
        return;
      }

      const { dataT, errorT } = await supabase.auth.signInWithOtp({
        email: tenantEmail,
        options: {
          shouldCreateUser: true,
        },
      });
      if (errorT) {
        console.error("Error signing up:", errorT.message);
      } else {
        alert("OTP has been sent to your email");
      }

      // Check profile for tenant
      const {
        data: existingProfileTenant,
        error: profileErrorTenant,
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("emailProfile", tenantEmail)
        .single();

      if (existingProfileTenant) {
        console.error("Error fetching existing profile:", profileErrorTenant);
      } else if (!existingProfileTenant) {
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert([
            {
              first_name: tenantFirstName,
              last_name: tenantLastName,
              roleOfUser: "tenant",
              emailProfile: tenantEmail,
              id: uuidv4(),
            },
          ]);

        if (insertError) {
          console.error("Error inserting new profile for tenant:", insertError);
        } else {
          console.log("Inserted new profile for tenant:", newProfile);
        }
      } else {
        console.log(
          "Profile with this email already exists:",
          existingProfileOwner
        );
      }
    }
  }; // end of handleAdd

  //const [open, setOpen] = useState(false); // State for controlling dialog visibility

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
            Add Unit
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ textDecoration: "underline" }}
            display="inline"
            style={{ color: "#333", padding: "2%" }}
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
                  pattern: "[0-9]*",
                }}
              />
            </Grid>
          </Grid>
          <br />
          <Typography
            variant="h5"
            gutterBottom
            sx={{ textDecoration: "underline" }}
            display="inline"
            style={{ color: "#333", padding: "2%" }}
          >
            Unit Information
          </Typography>
          <br />
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
                name="unitSize"
                type="text"
                label="Size"
                value={unitSize}
                onChange={(event) => handleSizeChange(event.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">sqft</InputAdornment>
                  ),
                  inputMode: "numeric",
                  pattern: "[0-9]*", //Allow only numeric numbers
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
                onChange={(event) =>
                  handleCondoFeeSQFTChange(event.target.value)
                }
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
              <Grid container spacing={2} style={{ margin: "0.2%" }}>
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
                      pattern: "[0-9]*",
                    }}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid container justifyContent="center" style={{ marginTop: "20px" }}>
            <Button variant="contained" size="large" onClick={handleAdd}>
              Save
            </Button>
            {isIncompleteForm && (
              <Dialog
                open={isIncompleteForm}
                onClose={() => setIsIncompleteForm(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Incomplete Form"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Please fill out all required fields before saving.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setIsIncompleteForm(false)}
                    color="primary"
                    autoFocus
                  >
                    Okay
                  </Button>
                </DialogActions>
              </Dialog>
            )}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default AddUnitForm;
