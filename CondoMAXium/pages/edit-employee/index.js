import {
  Button,
  Container,
  Grid,
  Box,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  AppBar,
  Toolbar, 
  IconButton,
  Badge,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import supabase from "../../config/supabaseClient";
import styles from "../../styles/units.module.css";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import Head from "next/head";

const EditEmployeePage = () => {
  const router = useRouter();
  const { id: employeeId } = router.query;
  console.log("we're workig on unitid: ", employeeId);
  //initialize unit object to save fetched data
  const [employee, setEmployee] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    position: "",
  });
  //A copy of unit used for comparing changes
  const [employeeCopy, setUnitCopy] = useState({ ...employee });

  //fetch data from DB
  useEffect(() => {
    async function fetchEmployee() {
      try {
        const { data, error } = await supabase
          .from("employees")
          .select("*")
          .eq("id", employeeId);
        if (error) {
          throw error;
        }
        if (data && data.length > 0) {
          const fetchedEmployee = data[0];
          setEmployee({
            first_name: fetchedEmployee.first_name || "",
            last_name: fetchedEmployee.last_name || "",
            phone_number: fetchedEmployee.phone_number || "",
            email: fetchedEmployee.email || "",
            position: fetchedEmployee.position || "",
          });
          setUnitCopy({
            first_name: fetchedEmployee.first_name || "",
            last_name: fetchedEmployee.last_name || "",
            phone_number: fetchedEmployee.phone_number || "",
            email: fetchedEmployee.email || "",
            position: fetchedEmployee.position || "",
          });

          console.log("employee name is ", first_name, last_name);
        } else {
          console.log("Employee not found");
        }
      } catch (error) {
        console.error("Error fetching employee", error.message);
      }
    }

    if (employeeId) {
      fetchEmployee();
      console.log("Employee ID is fetched");
    }
  }, [employeeId]);

  //update employee
  const handleLocalChange = (event) => {
    const { name, value } = event.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //push updates to the DB
  const handleDBChange = async () => {
    if (!employeeId) {
      console.error("No employee ID found, cannot update.");
      return; // Stop the function if employeeId is undefined
    }

    try {
      const updatedFields = {};
      for (const key in employee) {
        if (employee[key] !== employeeCopy[key]) {
          updatedFields[key] = employee[key];
        }
      }

      if (Object.keys(updatedFields).length === 0) {
        console.log("No changes detected, no update required.");
        return; // If no fields have changed, no need to execute an update
      }

      console.log("updated fields", updatedFields);
      const { error } = await supabase
        .from("employees")
        .update(updatedFields)
        .eq("id", employeeId);
      if (error) throw error;

      console.log("Employee updated successfully");
      router.push("/manage-employees");
    } catch (error) {
      console.error("Error updating employee:", error.message);
    }
  };

  return (
    <>
      <Head>
        <script
          id="sc-script"
          src="https://cdn.smartcat-proxy.com/60a29c2d1d4341e38fbb9d3f4a3bef3d/script-v1/__translator.js?hash=7e6e37c59d0bf7e0a6f687b25f488757"
        />
      </Head>
      <AppBar position="absolute">
            <Toolbar sx={{ pr: "24px" }}>
              {/* <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                // onClick={toggleDrawer}
                sx={{
                  marginRight: "36px",
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton> */}
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                CondoMAXium
              </Typography>
              <Typography
                component="h2"
                variant="h6"
                color="inherit"
                noWrap
                onClick={() => router.push("/dashboardCMC")}
                // sx={{ flexGrow: 1 }}
              >
                Dashboard
              </Typography>
              <IconButton color="inherit">
                <Badge color="secondary">
                  <NotificationsIcon  onClick={() => router.push("/notifications-cmc")}/>
                </Badge>
              </IconButton>
              <IconButton aria-label="profile" color="inherit" onClick={() => router.push("/profile")}>
                <AccountCircleIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
      <Box className={styles.outsideContainer}>
        <Container className={styles.unitsContainer}>
          <Typography
            variant="h4"
            gutterBottom
            className={styles.editUnitsHeader}
          >
            Edit Employee
          </Typography>
          {/* <form onSubmit={handleDBChange}> */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                name="first_name"
                label="First Name"
                value={employee.first_name}
                onChange={handleLocalChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="last_name"
                label="Last Name"
                value={employee.last_name}
                onChange={handleLocalChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="email"
                label="Email"
                value={employee.email}
                onChange={handleLocalChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="phone_number"
                label="Phone Number"
                value={employee.phone_number}
                onChange={handleLocalChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="position-select-label">Position</InputLabel>
                <Select
                  labelId="position-select-label"
                  name="position"
                  label="Position"
                  value={employee.position}
                  onChange={handleLocalChange}
                  required
                >
                  <MenuItem value="financial">Financial Analyst</MenuItem>
                  <MenuItem value="daily_op">Daily Operations Analyst</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container justifyContent="center" style={{ marginTop: "20px" }}>
          <Button
                  variant="contained"
                  size="large"
                  startIcon={<ArrowBackIosNewIcon />}
                  sx={{ my: 1, ml: 5 }}
                  onClick={() => router.push("/manage-employees")}
                >
                  Back
                </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              onClick={handleDBChange}
              sx={{ my: 1, ml: 5 }}
            >
              Save
            </Button>
          </Grid>
          {/* </form> */}
        </Container>
      </Box>
    </>
  );
};

export default EditEmployeePage;
