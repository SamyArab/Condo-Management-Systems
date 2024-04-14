import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Checkbox,
} from "@mui/material";

const AddAmenityForm = () => {
  const [amenityName, setAmenityName] = useState("");
  const [floor, setFloor] = useState("");
  const [sqft, setSqft] = useState("");
  const [days, setDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [hours, setHours] = useState({ from: "", to: "" });
  const [description, setDescription] = useState("");

  const {
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
  } = days;

  const error =
    [monday, tuesday, wednesday, thursday, friday, saturday, sunday].filter(
      (v) => v
    ).length < 2;

  const router = useRouter();

  const handleDayChange = (event) => {
    setDays({
      ...days,
      [event.target.name]: event.target.checked,
    });
    console.log("day has been checked: ", event.target.name);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    //add amenity to db
  };

  return (
    <div style={{ paddingTop: "140px", paddingBottom: "40px" }}>
      {" "}
      <Container>
        <Typography variant="h4" gutterBottom>
          Add Amenity
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                name="amenityName"
                label="Name"
                value={amenityName}
                onChange={(event) => setAmenityName(event.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="floor"
                label="Floor Number"
                value={floor}
                onChange={(event) => setFloor(event.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="sqft"
                label="Square Footage"
                value={sqft}
                onChange={(event) => setSqft(event.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={9}>
              <FormControl
                required
                error={error}
                component="fieldset"
                sx={{ m: 3 }}
                variant="standard"
              >
                <FormLabel>Days Open (at least 2)</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={monday}
                        onChange={handleDayChange}
                        name="monday"
                      />
                    }
                    label="Monday"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={tuesday}
                        onChange={handleDayChange}
                        name="tuesday"
                      />
                    }
                    label="Tuesday"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={wednesday}
                        onChange={handleDayChange}
                        name="wednesday"
                      />
                    }
                    label="Wednesday"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={thursday}
                        onChange={handleDayChange}
                        name="thursday"
                      />
                    }
                    label="Thursday"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={friday}
                        onChange={handleDayChange}
                        name="friday"
                      />
                    }
                    label="Friday"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={saturday}
                        onChange={handleDayChange}
                        name="saturday"
                      />
                    }
                    label="Saturday"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={sunday}
                        onChange={handleDayChange}
                        name="sunday"
                      />
                    }
                    label="Sunday"
                  />
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
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
              onClick={() => router.push("/profile")}
            >
              Submit
            </Button>
          </Grid>
        </form>
      </Container>
    </div>
  );
};

export default AddAmenityForm;
