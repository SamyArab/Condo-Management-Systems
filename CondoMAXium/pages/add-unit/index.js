import {
  Button,
  Container,
  Grid,
  TextField,
  Typography
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import supabase from "../../config/supabaseClient";


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
    } catch (error) {
      console.error("Error adding unit: ", error.message);
    }

  };


  const [open, setOpen] = useState(false); // State for controlling dialog visibility

  const router = useRouter();

  return (
    <div style={{ paddingTop: "140px", paddingBottom: "40px" }}>
      {" "}
      {/* Add padding top and bottom */}
      <Container>
        <Typography variant="h4" gutterBottom>
          Add Unit
        </Typography>
        <form onSubmit={handleAdd}>
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
                onChange={(event) =>setUnitNumber(event.target.value)}
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
            <Grid item xs={6}></Grid>
            <Grid item xs={6}>
              <div class="dropdown">
                <button class="dropdown-btn">Occupied By</button>
                <div class="dropdown-content">
                  <a href="#" onClick={() => setOccupiedBy("Owner")}>Owner</a>
                  <a href="#" onClick={() => setOccupiedBy("Tenant")}>Tenant</a>
                </div>
              </div>
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
              type="submit"
              variant="contained"
              color="inherit"
              onClick={() => router.push("/units2")}
            >
              Add Unit
            </Button>
          </Grid>
        </form>
      </Container>
    </div>
  );
};

export default AddUnitForm;
