import {
  Button,
  Container,
  Grid,
  TextField,
  Typography
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from 'react';
import supabase from "../../config/supabaseClient";

const EditUnitPage = () => {
  const router = useRouter();
  const { index } = router.query;
  console.log("we're workig on index: ", index)

  const [unit, setUnit] = useState({
    property_name: '',
    unit_number: '',
    unit_owner: '',
    occupied_by: '',
    tenantFullName: '',
    size: '',
    parking_number: '',
    plocker_number: '',
    condo_fee: '',
  });

  const [unitCopy, setUnitCopy] = useState({...unit});

  useEffect(() => {
    async function fetchUnit() {
      try {
        const { data, error } = await supabase.from('units').select('*').eq('id', index+1);
        if (error) {
          throw error;
        }
        if (data && data.length > 0) {
          const fetchedUnit = data[0];
          setUnit({
            property_name: fetchedUnit.property_name || '', // Default value for property_name
            unit_number: fetchedUnit.unit_number || '', // Default value for unit_number
            unit_owner: fetchedUnit.unit_owner || '', // Default value for unit_owner
            occupied_by: fetchedUnit.occupied_by || '', // Default value for occupied_by
            tenantFullName: fetchedUnit.tenantFullName || '', // Default value for tenantFullName
            size: fetchedUnit.size || '', // Default value for size
            parking_number: fetchedUnit.parking_number || '', // Default value for parking_number
            plocker_number: fetchedUnit.locker_number || '', // Default value for plocker_number
            condo_fee: fetchedUnit.condo_fee || '', // Default value for condo_fee
          });
          setUnitCopy({
            property_name: fetchedUnit.property_name || '', // Default value for property_name
            unit_number: fetchedUnit.unit_number || '', // Default value for unit_number
            unit_owner: fetchedUnit.unit_owner || '', // Default value for unit_owner
            occupied_by: fetchedUnit.occupied_by || '', // Default value for occupied_by
            tenantFullName: fetchedUnit.tenantFullName || '', // Default value for tenantFullName
            size: fetchedUnit.size || '', // Default value for size
            parking_number: fetchedUnit.parking_number || '', // Default value for parking_number
            plocker_number: fetchedUnit.locker_number || '', // Default value for plocker_number
            condo_fee: fetchedUnit.condo_fee || '', // Default value for condo_fee
          });
          
          console.log("property name is ", property_name)
        } else {
          console.log('Unit not found');
        }
      } catch (error) {
        console.error('Error fetching unit', error.message);
      }
    }
  
    if (index) {
      fetchUnit();
    }
  }, [index]);
  
  // const unitCopy= {...unit};

  const handleLocalChange = (event) => {
    const { name, value } = event.target;
    setUnit((prevUnit) => ({
      ...prevUnit,
      [name]: value,
    }));
  };

  const handleDBChange = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    
    try {
      // Construct an object to hold the updated fields
      const updatedFields = {};
      
      // Compare each field in unit with the corresponding field in originalUnit
      for (const key in unit) {
        if (unit[key] !== unitCopy[key]) {
          updatedFields[key] = unit[key]; // Add the changed field to updatedFields
        }
      }
      console.log("updated fields", updatedFields)
      // Execute the update query to update only the changed fields
      const { error } = await supabase.from('units').update(updatedFields).eq('id', index + 1);
      if (error) {
        throw error;
      }
      
      console.log('Unit updated successfully');
      
      // Optionally, you can navigate the user to another page or perform other actions upon successful save.
    } catch (error) {
      console.error("Error updating unit:", error.message);
    }
  };

  return (
    <div style={{ paddingTop: "140px", paddingBottom: "40px" }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Edit Unit
        </Typography>
        <form onSubmit={handleDBChange}>
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
                name="unit_owner"
                label="Owners Full Name"
                value={unit.unit_owner}
                onChange={handleLocalChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}></Grid>
            {/* <Grid item xs={6}>
              <div class="dropdown">
                <button class="dropdown-btn">Occupied By</button>
                <div class="dropdown-content">
                  <a href="#" onClick={() => setoccupied_by("Owner")}>Owner</a>
                  <a href="#" onClick={() => setoccupied_by("Tenant")}>Tenant</a>
                </div>
              </div>
            </Grid> */}
            {unit.occupied_by === "Tenant" && (
              <Grid item xs={6}>
                <TextField
                  name="tenantFullName"
                  label="Tenant Full Name"
                  value={unit.enantFullName}
                  onChange={handleLocalChange}
                  fullWidth
                  margin="normal"
                  required
                />
              </Grid>
            )}
            
            <Grid item xs={6}>
              <TextField
                name="size"
                label="Unit Size"
                value={unit.size}
                onChange={handleLocalChange}
                fullWidth
                margin="normal"
                required
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
                name="plocker_number"
                label="Assigned Locker Number"
                value={unit.plocker_number}
                onChange={handleLocalChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="condo_fee"
                label="Condo Fee"
                value={unit.condo_fee}
                onChange={handleLocalChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
          </Grid>
          <Grid container justifyContent="center" style={{ marginTop: "20px" }}>
            <Button
              type="submit"
              variant="contained"
              color="inherit"
              onClick={() => router.push("/units2")}
            >
              Edit Unit
            </Button>
          </Grid>
        </form>
      </Container>
    </div>
  );
};

export default EditUnitPage;