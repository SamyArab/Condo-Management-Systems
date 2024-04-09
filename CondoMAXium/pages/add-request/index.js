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
  import React, { useState } from "react";
  import supabase from "../../config/supabaseClient";
  import styles from "../../styles/units.module.css";

  const {
    data:{user}
  }=await supabase.auth.getUser();

  const handleAdd = async (event) => {
    event.preventDefault();

    try {
      const { data, error } = await supabase.from("units").insert([
        {
          request_subject: requestSubject,
          request_type: requestType,
          request_description: requestDescription,
        },
      ]);

      console.log("Successfully added request: ", data);
      router.push("/requests");
    } catch (error) {
      console.error("Error adding unit: ", error.message);
    }

  };

  const AddRequestForm =()=> {
    const [requestSubject, setRequestSubject] = useState("");
    const [requestType, setRequestType] = useState("");
    const [requestDescription, setRequestDescription] = useState("");

    const router = useRouter();

    return (
        <Box className={styles.outsideContainer}>
            <Container className={styles.unitsContainer}>
            <Typography variant="h4" gutterBottom className={styles.editUnitsHeader}>
              Create Request
            </Typography>
            {/* <form onSubmit={handleAdd}> */}
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                  <TextField
                    name="requestSubject"
                    label="Request Subject"
                    value={requestSubject}
                    onChange={(event) => setRequestSubject(event.target.value)}
                    fullWidth
                    margin="normal"
                    required
                  />
                </Grid>
                {/* <Grid item xs={6}></Grid> */}
                <Grid item xs={6}>
                  <FormControl required fullWidth variant="outlined" margin="normal">
                    <InputLabel id="request-type-label">Request Type</InputLabel>
                    <Select
                      labelId="request-type-label"
                      id="request-type-select"
                      value={requestType}
                      onChange={(event) => setRequestType(event.target.value)}
                      label="Request Type"
                    >
                      <MenuItem value="Maintenance">Maintenance</MenuItem>
                      <MenuItem value="Access">Access</MenuItem>
                      <MenuItem value="Violation">Violation</MenuItem>
                      <MenuItem value="Renovation">Renovation</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
    
                <Grid item xs={12}>
                  <TextField
                    name="requestDescription"
                    label="Description"
                    value={requestDescription}
                    onChange={(event) => setRequestDescription(event.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    multiline
                    rows={12}
                    variant="outlined"
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
  }

  export default AddRequestForm;

