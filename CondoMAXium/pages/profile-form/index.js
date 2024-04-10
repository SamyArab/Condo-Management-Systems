// ProfilePage.tsx
// import Header from "../../components/layout/Header";
import React, { useState } from "react";

import {
  Typography,
  Container,
  Box,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  InputAdornment,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import styles from "../../styles/profileForm.module.css";

const ProfileForm = () => {
  //All initialized values for the needed fields (in order)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [CMC, setCMC] = useState("");
  const [profileType, setProfileType] = useState("");
  const [inputFields, setInputFields] = useState([
    { name: "", unitId: "", owner: "", occupant: "", unitSize: "" },
  ]);
  const [open, setOpen] = useState(false);

  //All the handleChange methods needed (in order)

  //handle method for first name
  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  //handle method for last name
  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  //handle method for phone number
  const handlePhoneNumberChange = (event) => {
    // Format the phone number as the user types
    const formattedPhoneNumber = formatPhoneNumber(event.target.value);
    setPhoneNumber(formattedPhoneNumber);
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

  //handle method for CMC
  const handleCMCChange = (event) => {
    const selectedCMC = event.target.value;
    setCMC(selectedCMC);
  };

  //handle method for profile type (owner or tenant)
  const handleProfileTypeChange = (event) => {
    const selectedType = event.target.value;
    setProfileType(selectedType);

    // Update each 'owner' and 'occupant' field in the inputFields array based on the selected type
    setInputFields((prevFields) =>
      prevFields.map((field) => {
        return {
          ...field,
          owner: selectedType === "Owner" ? "Myself" : "",
          occupant: selectedType === "Tenant" ? "A tenant" : "",
        };
      })
    );
  };

  //handle method for the properties fields
  const handleFieldsChange = (index, event) => {
    let data = [...inputFields];
    const { name, value } = event.target;

    // Ensure that 'unitId' and 'unitSize' accept only numeric input
    if ((name === "unitId" || name === "unitSize") && !/^\d*$/.test(value)) {
      // If non-numeric input is detected, do not update the state
      return;
    }

    data[index][name] = value;

    // Set the default value for the 'owner' field based on the selected profileType
    if (name === "owner" && profileType === "Owner") {
      data[index][name] = "Myself";
    }

    // Set the default value for the 'occupant' field based on the selected profileType
    if (name === "occupant" && profileType === "Tenant") {
      data[index][name] = "A tenant";
    }

    setInputFields(data);
  };

  //method to add property fields
  const addFields = () => {
    let newfield = {
      name: "",
      unitId: "",
      owner: profileType === "Owner" ? "Myself" : "",
      occupant: profileType === "Tenant" ? "A tenant" : "",
      unitSize: "",
    };
    setInputFields([...inputFields, newfield]);
  };

  //method to remove property fields
  const removeFields = (index) => {
    let data = [...inputFields];
    // Allow removal only if there is more than one field
    if (data.length > 1) {
      data.splice(index, 1);
      setInputFields(data);
    } else {
      //show a message or take other actions
      alert("Cannot remove the only field.");
    }
  };

  //handle method for submit the form
  const handleSubmitVerification = (event) => {
    event.preventDefault();

    // Check if all necessary fields are filled out
    const isFormValid =
      firstName &&
      lastName &&
      phoneNumber &&
      CMC &&
      profileType &&
      inputFields.every(
        (field) =>
          field.name &&
          field.unitId &&
          field.owner &&
          field.occupant &&
          field.unitSize
      );

    if (isFormValid) {
      // Open the dialogue if the form is valid
      handleClickOpen();
    } else {
      // Optionally, you can show an error message or take other actions
      alert("Please fill out all necessary fields before submitting.");
    }
  };

  //handle method to open dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  //handle method to close dialog
  const handleClose = () => {
    setOpen(false);
    handleSubmitForm();
  };

  //handle method to officialy submit form, it is not correct because it must be linked to the backend
  const handleSubmitForm = () => {
    // Submit the form (you can replace this with your actual form submission logic)
    alert("Form submitted successfully!");
  };

  return (
    <>
      {/* <Header></Header> */}
      <Box className={styles.outsideContainer}>
        <Container className={styles.unitsContainer} maxWidth="sm">
          {/* grid for complete page!! */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Typography
                variant="h4"
                component="h1"
                className={styles.profileFormHeader}
              >
                Profile Information
              </Typography>
            </Grid>

            {/* grid for entire form!! */}
            <Grid item xs={12}>
              <form>
                {/* grid for first 5 fields */}
                <Grid item xs={12} sm={8} className={styles.profileInfoGrid}>
                  {/* firs name text field */}
                  <TextField
                    required
                    label="First Name"
                    name="firstName"
                    type="text"
                    value={firstName}
                    onChange={handleFirstNameChange}
                    variant="filled"
                    fullWidth
                  />
                  <br />
                  <br />

                  {/* last name text field */}
                  <TextField
                    required
                    label="Last Name"
                    name="lastName"
                    type="text"
                    value={lastName}
                    onChange={handleLastNameChange}
                    variant="filled"
                    fullWidth
                  />
                  <br />
                  <br />

                  {/* phone number text field */}
                  <TextField
                    required
                    label="Phone Number"
                    name="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    variant="filled"
                    fullWidth
                  />
                  <br />
                  <br />

                  {/* CMC dropdown */}
                  <FormControl required variant="filled" fullWidth>
                    <InputLabel>Associated Condo Management Company</InputLabel>
                    <Select
                      inputProps={{ "data-testid": "CMC-select" }}
                      name="CMC"
                      value={CMC}
                      onChange={handleCMCChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={"test"}>test</MenuItem>
                      {/* <MenuItem value={'Tenant'}>I am a tenant</MenuItem> */}
                    </Select>
                  </FormControl>
                  <br />
                  <br />

                  {/* profile type dropdown, te result of this dropdown 
                            affects 2 of the property fields*/}
                  <FormControl required variant="filled" fullWidth>
                    <InputLabel>Owner/Tenant</InputLabel>
                    <Select
                      inputProps={{ "data-testid": "type-select" }}
                      name="type"
                      value={profileType}
                      onChange={handleProfileTypeChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={"Owner"}>I am an owner</MenuItem>
                      <MenuItem value={"Tenant"}>I am a tenant</MenuItem>
                    </Select>
                  </FormControl>
                  <br />
                  <br />

                  {/* end of first 5 fields grid */}
                </Grid>
                <br />
                <br />

                {/* box for properties fields */}
                <Box className={styles.unitsBox}>
                  <Typography
                    variant="h5"
                    component="h5"
                    className={styles.textFeildDesc}
                  >
                    Properties
                  </Typography>

                  {/* map to display row for property fields */}
                  {inputFields.map((input, index) => {
                    return (
                      <div key={index}>
                        <br />

                        {/* grid for complete row for property fields */}
                        <Grid container spacing={1}>
                          {/* grid for building name text field */}
                          <Grid
                            item
                            xs={12}
                            sm={3}
                            className={styles.searchGrid}
                          >
                            <TextField
                              required
                              name="name"
                              label="Building Name"
                              value={input.name}
                              onChange={(event) =>
                                handleFieldsChange(index, event)
                              }
                              variant="filled"
                              fullWidth
                            />
                          </Grid>

                          {/* grid for unit id text field */}
                          <Grid
                            item
                            xs={12}
                            sm={2}
                            className={styles.searchGrid}
                          >
                            <TextField
                              required
                              name="unitId"
                              type="text"
                              label="Unit Number"
                              value={input.unitId}
                              onChange={(event) =>
                                handleFieldsChange(index, event)
                              }
                              variant="filled"
                              fullWidth
                              inputProps={{
                                inputMode: "numeric",
                                pattern: "[0-9]*", // Allow only numeric input
                              }}
                            />
                          </Grid>

                          {/* grid for owner name text field */}
                          <Grid
                            item
                            xs={12}
                            sm={3}
                            className={styles.searchGrid}
                          >
                            <TextField
                              required
                              name="owner"
                              label="Owners Full Name"
                              value={input.owner}
                              onChange={(event) =>
                                handleFieldsChange(index, event)
                              }
                              variant="filled"
                              fullWidth
                            />
                          </Grid>

                          {/* grid for occupant dropdown */}
                          <Grid
                            item
                            xs={12}
                            sm={2}
                            className={styles.searchGrid}
                          >
                            <FormControl required variant="filled" fullWidth>
                              <InputLabel>Occupant</InputLabel>
                              <Select
                                inputProps={{
                                  "data-testid": "occupant-select",
                                }}
                                name="occupant"
                                value={input.occupant}
                                onChange={(event) =>
                                  handleFieldsChange(index, event)
                                }
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                <MenuItem value={"The owner"}>
                                  The owner
                                </MenuItem>
                                <MenuItem value={"A tenant"}>A tenant</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          {/* grid for unit size text field */}
                          <Grid
                            item
                            xs={12}
                            sm={2}
                            className={styles.searchGrid}
                          >
                            <TextField
                              required
                              name="unitSize"
                              type="text"
                              label="Size"
                              value={input.unitSize}
                              onChange={(event) =>
                                handleFieldsChange(index, event)
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    sqft
                                  </InputAdornment>
                                ),
                                inputMode: "numeric",
                                pattern: "[0-9]*", //Allow only numeric numbers
                              }}
                              variant="filled"
                              fullWidth
                            />
                          </Grid>

                          {/* end of grid for complete row for property fields */}
                        </Grid>
                        <Button onClick={() => removeFields(index)}>
                          Remove
                        </Button>
                      </div>
                    );
                    // end of map
                  })}

                  <Button onClick={addFields}>Add More..</Button>
                  <Typography size="large" className={styles.textFeildDesc}>
                    Further information about the properties concenerning
                    yourself can be added after the completion of this form.
                  </Typography>

                  {/* end of box for property fields */}
                </Box>
                <br />
                <br />
                {/* submit button, further functionalities for backend are missing */}
                <Button type="submit" onClick={handleSubmitVerification}>
                  Submit
                </Button>

                {/* dialog to explain that they will complete further information later if they want */}
                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>{"Don't Worry!"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Further information can be added afterwards about the
                      units that concern yourself and the payment information.
                      You will also be able to change the current information if
                      there is an error.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                      OK
                    </Button>
                  </DialogActions>
                </Dialog>
                {/* end of form */}
              </form>
              {/* end of grid for entire form */}
            </Grid>
            {/* end of grid for entire page */}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default ProfileForm;
