import {
  Button,
  Container,
  Grid,
  Box,
  TextField,
  Typography,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from 'react';
import supabase from "../../config/supabaseClient";
import styles from "../../styles/units.module.css";

const EditUnitPage = () => {
  const [isIncompleteForm, setIsIncompleteForm] = useState(false);


  const router = useRouter();
  const { unitid } = router.query;
  console.log("we're workig on unitid: ", unitid)
  //initialize unit object to save fetched data 
  const [unit, setUnit] = useState({
    property_name: '',
    unit_number: '',
    first_name_owner: '',
    last_name_owner: '',
    emailUnit: '',
    owner_phone: '',
    first_name_tenant: '',
    last_name_tenant: '',
    tenant_email: '',
    tenant_phone: '',
    occupied_by: '',
    size: '',
    condo_fee_sqft: '',
    parking_fee: '',
    parking_number: '',
    locker_number: '',
  });

  //A copy of unit used for comparing changes
  const [unitCopy, setUnitCopy] = useState({...unit});

  //fetch data from DB
  useEffect(() => {
    async function fetchUnit() {
      try {
        const { data, error } = await supabase.from('units').select('*').eq('id', unitid);
        if (error) {
          throw error;
        }
        if (data && data.length > 0) {
          const fetchedUnit = data[0];
          setUnit({
            property_name: fetchedUnit.property_name || '',
            unit_number: fetchedUnit.unit_number || '',
            first_name_owner: fetchedUnit.first_name_owner || '',
            last_name_owner: fetchedUnit.last_name_owner || '',
            emailUnit: fetchedUnit.emailUnit || '',
            owner_phone: fetchedUnit.owner_phone || '',
            first_name_tenant: fetchedUnit.first_name_tenant || '',
            last_name_tenant: fetchedUnit.last_name_tenant || '',
            tenant_email: fetchedUnit.tenant_email || '',
            tenant_phone: fetchedUnit.tenant_phone || '',
            occupied_by: fetchedUnit.occupied_by || '',
            size: fetchedUnit.size || '',
            condo_fee_sqft: fetchedUnit.condo_fee_sqft || '',
            parking_fee: fetchedUnit.parking_fee || '',            
            parking_number: fetchedUnit.parking_number || '',
            locker_number: fetchedUnit.locker_number || '',
          });
          setUnitCopy({
            property_name: fetchedUnit.property_name || '',
            unit_number: fetchedUnit.unit_number || '',
            first_name_owner: fetchedUnit.first_name_owner || '',
            last_name_owner: fetchedUnit.last_name_owner || '',
            emailUnit: fetchedUnit.emailUnit || '',
            owner_phone: fetchedUnit.owner_phone || '',
            first_name_tenant: fetchedUnit.first_name_tenant || '',
            last_name_tenant: fetchedUnit.last_name_tenant || '',
            tenant_email: fetchedUnit.tenant_email || '',
            tenant_phone: fetchedUnit.tenant_phone || '',
            occupied_by: fetchedUnit.occupied_by || '',
            size: fetchedUnit.size || '',
            condo_fee_sqft: fetchedUnit.condo_fee_sqft || '',
            parking_fee: fetchedUnit.parking_fee || '',            
            parking_number: fetchedUnit.parking_number || '',
            locker_number: fetchedUnit.locker_number || '',
          });
          
          console.log("property name is ", unit.property_name);
        } else {
          console.log('Unit not found');
        }
      } catch (error) {
        console.error('Error fetching unit', error.message);
      }
    }
  
    if (unitid) {
      fetchUnit();
    }
  }, [unitid]);

  //update unit
  const handleLocalChange = (event) => {
    const { name, value } = event.target;
    let processedValue = value;
  
    // List of fields that should only accept numeric input
    const numericFields = ['size', 'condo_fee_sqft', 'parking_fee'];

    // Specific fields for phone number formatting
    const phoneFields = ['owner_phone', 'tenant_phone'];
  
    // If the field should only have numeric values, remove all non-numeric characters
    if (numericFields.includes(name)) {
      // Regular expression to remove any non-numeric characters from the input
      processedValue = value.replace(/[^\d.]/g, '');

      // You might also want to handle cases where there are multiple decimal points
      // This part ensures there's only one decimal point in the number
      const parts = processedValue.split('.');
      let decimalValue;
      if (parts.length > 2) {
        // Join the first part with the second part, discarding additional decimal points
        decimalValue = parts[0] + '.' + parts.slice(1).join('');
      } else {
        decimalValue = processedValue;
      }
    }

    // Apply phone number formatting for phone fields
    if (phoneFields.includes(name)) {
      processedValue = formatPhoneNumber(value);
    }
  
    setUnit((prevUnit) => ({
      ...prevUnit,
      [name]: processedValue,
    }));
  };

  //correct formatting for phone number
  const formatPhoneNumber = (input) => {
    // Remove non-numeric characters
    const numericInput = input.replace(/\D/g, '');
    
    // Apply the desired pattern (XXX-XXX-XXXX)
    const formattedPhoneNumber = numericInput.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');

    return formattedPhoneNumber;
  };

  //push database change
  const handleDBChange = async (event) => {
    event.preventDefault();
  
    // Prepare the updated unit object based on occupancy
    const updatedUnit = {
      ...unit,
      first_name_tenant: unit.occupied_by === "Owner" ? '' : unit.first_name_tenant,
      last_name_tenant: unit.occupied_by === "Owner" ? '' : unit.last_name_tenant,
      tenant_email: unit.occupied_by === "Owner" ? '' : unit.tenant_email,
      tenant_phone: unit.occupied_by === "Owner" ? '' : unit.tenant_phone,
      // Calculate condo_fee_total based on the provided formula
      condo_fee_total: (parseFloat(unit.condo_fee_sqft) * parseFloat(unit.size)) + parseFloat(unit.parking_fee, 10),
    };
  
    // Initialize an array with fields that are always required
    let requiredFields = [
      updatedUnit.property_name, 
      updatedUnit.unit_number, 
      updatedUnit.first_name_owner, 
      updatedUnit.last_name_owner, 
      updatedUnit.emailUnit, 
      updatedUnit.owner_phone, 
      updatedUnit.occupied_by, 
      updatedUnit.size,
      updatedUnit.condo_fee_sqft, 
      updatedUnit.parking_fee, 
      updatedUnit.parking_number, 
      updatedUnit.locker_number,
    ];
  
    // If the unit is occupied by a tenant, add tenant information fields to the validation list
    if (updatedUnit.occupied_by === "Tenant") {
      requiredFields = requiredFields.concat([
        updatedUnit.first_name_tenant, 
        updatedUnit.last_name_tenant, 
        updatedUnit.tenant_email, 
        updatedUnit.tenant_phone,
      ]);
    }
  
    // Check if all required fields are filled
    const isFormComplete = requiredFields.every(field => {
      if (typeof field === 'string') {
        return field.trim() !== '';
      }
      return field != null; // Checking for both null and undefined
    });
  
    if (!isFormComplete) {
      setIsIncompleteForm(true);
      return;
    }
  
    try {
      const { error } = await supabase.from('units').update(updatedUnit).eq('id', unitid);
      if (error) {
        throw error;
      }
      console.log('Unit updated successfully');
      router.push("/units");
    } catch (error) {
      console.error("Error updating unit:", error.message);
    }
  };
  

  return (
    <Box className={styles.outsideContainer}>
        <Container className={styles.unitsContainer}>
        <Typography variant="h4" gutterBottom className={styles.editUnitsHeader}>
          Edit Unit
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
                name="first_name_owner"
                label="Owners First Name"
                value={unit.first_name_owner}
                onChange={handleLocalChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="last_name_owner"
                label="Owners Last Name"
                value={unit.last_name_owner}
                onChange={handleLocalChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="emailUnit"
                label="Owners Email"
                value={unit.emailUnit}
                onChange={handleLocalChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="owner_phone"
                label="Owners Phone"
                value={unit.owner_phone}
                onChange={handleLocalChange}
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
                name="property_name"
                label="Property Name"
                value={unit.property_name}
                onChange={handleLocalChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="unit_number"
                label="Unit Number"
                value={unit.unit_number}
                onChange={handleLocalChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                required
                name='size'
                type='text'
                label='Size'
                value={unit.size}
                onChange={handleLocalChange}
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
                name="parking_number"
                label="Assigned Parking Number"
                value={unit.parking_number}
                onChange={handleLocalChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                name="locker_number"
                label="Assigned Locker Number"
                value={unit.locker_number}
                onChange={handleLocalChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                name="condo_fee_sqft"
                label="Condo Fee Per sqft (monthly)"
                value={unit.condo_fee_sqft}
                onChange={handleLocalChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="parking_fee"
                label="Condo Fee - Parking (monthly)"
                value={unit.parking_fee}
                onChange={handleLocalChange}
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
                  name="occupied_by"
                  labelId="occupied-by-label"
                  id="occupied-by-select"
                  label="Occupied By"
                  value={unit.occupied_by}
                  onChange={handleLocalChange}
                >
                  <MenuItem value="Owner">Owner</MenuItem>
                  <MenuItem value="Tenant">Tenant</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {unit.occupied_by === "Tenant" && (
              <Grid container spacing={2} 
                style={{margin: "0.2%"}}
                >
                <Grid item xs={6}>
                  <TextField
                    name="first_name_tenant"
                    label="Tenants First Name"
                    value={unit.first_name_tenant}
                    onChange={handleLocalChange}
                    fullWidth
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="last_name_tenant"
                    label="Tenants Last Name"
                    value={unit.last_name_tenant}
                    onChange={handleLocalChange}
                    fullWidth
                    margin="normal"
                    required
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    name="tenant_email"
                    label="Tenants Email"
                    value={unit.tenant_email}
                    onChange={handleLocalChange}
                    fullWidth
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="tenant_phone"
                    label="Tenants Phone"
                    value={unit.tenant_phone}
                    onChange={handleLocalChange}
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
              onClick={handleDBChange}
            >
              Save
            </Button>
            {isIncompleteForm && (
              <Dialog
                open={isIncompleteForm}
                // onClose={() => setIsIncompleteForm(false)}
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

export default EditUnitPage;