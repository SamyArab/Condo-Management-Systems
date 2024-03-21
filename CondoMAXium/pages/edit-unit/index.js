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
  const { unitid } = router.query;
  console.log("we're workig on unitid: ", unitid)
  //initialize unit object to save fetched data 
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
            unit_owner: fetchedUnit.unit_owner || '',
            occupied_by: fetchedUnit.occupied_by || '',
            tenantFullName: fetchedUnit.tenantFullName || '',
            size: fetchedUnit.size || '',
            parking_number: fetchedUnit.parking_number || '',
            plocker_number: fetchedUnit.locker_number || '',
            condo_fee: fetchedUnit.condo_fee || '',
          });
          setUnitCopy({
            property_name: fetchedUnit.property_name || '',
            unit_number: fetchedUnit.unit_number || '',
            unit_owner: fetchedUnit.unit_owner || '',
            occupied_by: fetchedUnit.occupied_by || '',
            tenantFullName: fetchedUnit.tenantFullName || '',
            size: fetchedUnit.size || '',
            parking_number: fetchedUnit.parking_number || '',
            plocker_number: fetchedUnit.locker_number || '',
            condo_fee: fetchedUnit.condo_fee || '',
          });
          
          console.log("property name is ", property_name)
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
    setUnit((prevUnit) => ({
      ...prevUnit,
      [name]: value,
    }));
  };

  //push updates to the DB
  const handleDBChange = async (event) => {
    
    try {
      const updatedFields = {};
      for (const key in unit) {
        if (unit[key] !== unitCopy[key]) {
          updatedFields[key] = unit[key];
        }
      }
      console.log("updated fields", updatedFields)
      const { error } = await supabase.from('units').update(updatedFields).eq('id', unitid);
      if (error) {
        throw error;
      }
      console.log('Unit updated successfully');
      
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
              onClick={() => router.push("/units")}
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