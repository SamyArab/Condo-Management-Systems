// ProfilePage.tsx
import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useRouter } from "next/router";
// import Header from "../../components/layout/Header";

import {
  Box,
  Button,
  Checkbox,
  Container,
  TextField,
  Grid,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  AppBar,
  Toolbar, 
  IconButton,
  Badge,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
// import VisibilityIcon from "@mui/icons-material/Visibility";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import supabase from "../../config/supabaseClient";
import styles from "../../styles/units.module.css";

import Head from "next/head";

const positionTitles = {
  financial: "Financial Analyst",
  daily_op: "Daily Operations Analyst",
};

const ManageEmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  //fetching employees from database
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data, error } = await supabase.from("employees").select("*");
        if (error) {
          console.error("Error fetching employees", error.message);
          alert("Failed to fetch employees: " + error.message);
          setEmployees([]);
        }
        console.log("Fetched employees:", data); // Check what is being received
        setEmployees(data || []);
      } catch (error) {
        console.error("Error fetching employees", error.message);
        setEmployees([]);
      }
    };

    fetchEmployees();
  }, []);

  //to handle search bar
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // to filter
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.role &&
        employee.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
      employee.phone_number.includes(searchTerm)
  );

  const router = useRouter();

  // Route to the edit-employee page
  const handleEditEmployeeClick = (employeeId) => {
    console.log("Editing employee with ID:", employeeId);
    router.push({
      pathname: "/edit-employee", // Adjusted to point to the edit-employee page
      query: { id: employeeId }, // Changed query parameter to 'id' for clarity and consistency
    });
  };

  // Route to add a new employee page
  const handleAddEmployeeClick = () => {
    const result = router.push("/add-employee"); // Direct routing to the add-employee page
    console.log("Adding new employee");
    // Additional logic can be implemented based on the result, if needed
  };

  return (
    <>
      <Head>
        <script
          id="sc-script"
          src="https://cdn.smartcat-proxy.com/60a29c2d1d4341e38fbb9d3f4a3bef3d/script-v1/__translator.js?hash=7e6e37c59d0bf7e0a6f687b25f488757"
        />
      </Head>
      <AppBar position="absolute" open={open}>
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
        <Container
          className={styles.unitsContainer}
          //CHECK IF "sm" CAUSES ISSUES
          maxWidth="sm"
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h4"
                component="h1"
                className={styles.unitsHeader}
              >
                Employees
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} className={styles.searchGrid}>
              <Box className={styles.searchBox}>
                <TextField
                  size="small"
                  type="text"
                  placeholder="Search here"
                  onChange={handleSearch}
                  value={searchTerm}
                  fullWidth
                />
              </Box>
              <Box textAlign="right" style={{ marginRight: "20px" }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddEmployeeClick}
                >
                  Add Employee
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box className={styles.unitsBox}>
                <TableContainer>
                  <Table className={styles.unitsTable}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <b>First Name</b>
                        </TableCell>
                        <TableCell>
                          <b>Last Name</b>
                        </TableCell>
                        <TableCell>
                          <b>E-mail</b>
                        </TableCell>
                        <TableCell>
                          <b>Phone Number</b>
                        </TableCell>
                        <TableCell>
                          <b>Position</b>
                        </TableCell>
                        <TableCell>
                          <b>Action</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* print values from the DB */}
                      {filteredEmployees.map((employee, index) => (
                        <TableRow key={index}>
                          <TableCell>{employee.first_name}</TableCell>
                          <TableCell>{employee.last_name}</TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>{employee.phone_number}</TableCell>
                          <TableCell>
                            {positionTitles[employee.position] || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<EditIcon />} // Ensure EditIcon is imported
                              onClick={() =>
                                handleEditEmployeeClick(employee.id)
                              }
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default ManageEmployeesPage;
