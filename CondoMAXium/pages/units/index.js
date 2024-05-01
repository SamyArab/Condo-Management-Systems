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
  Badge
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import supabase from "../../config/supabaseClient";
import styles from "../../styles/units.module.css";

import Head from "next/head";

const CMCUnits = () => {
  const [units, setUnits] = useState([]);
  // const [owner, setOwner] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  //fetching units from database
  useEffect(() => {
    async function fetchUnits() {
      try {
        const { data: unitData, error: unitError } = await supabase
          .from("units")
          .select("*");
        setUnits(unitData);
        if (unitError) {
          throw error;
        }
      } catch (error) {
        console.log("Error fetching units", error.message);
      }
    }

    fetchUnits();
  }, []);

  //for filters
  // const [selectedProperties, setSelectedProperties] = useState([]);
  // const [selectedUnitNumbers, setSelectedUnitNumbers] = useState([]);
  // const [selectedOwners, setSelectedOwners] = useState([]);
  // const [selectedOccupy, setSelectedOccupy] = useState([]);
  // const [selectedSizes, setSelectedSizes] = useState([]);

  //to handle search bar
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  //to handle property filter
  // const handlePropertyChange = (event) => {
  //   const value = Array.isArray(event.target.value) ? event.target.value : [event.target.value];
  //   setSelectedProperties(value);
  // };

  //to handle unit number filter
  // const handleUnitNumberChange = (event) => {
  //   const value = Array.isArray(event.target.value) ? event.target.value : [event.target.value];
  //   setSelectedUnitNumbers(value);
  // };

  //to handle owner filter
  // const handleOwnerChange = (event) => {
  //   const value = Array.isArray(event.target.value) ? event.target.value : [event.target.value];
  //   setSelectedOwners(value);
  // };

  //to handle owner filter
  // const handleOccupyChange = (event) => {
  //   const value = Array.isArray(event.target.value) ? event.target.value : [event.target.value];
  //   setSelectedOccupy(value);
  // };

  //to handle owner filter
  // const handleSizeChange = (event) => {
  //   const value = Array.isArray(event.target.value) ? event.target.value : [event.target.value];
  //   setSelectedSizes(value);
  // };

  //to not repeat values in filter
  // const uniqueProperties = Array.from(
  //   new Set(unitsList.units.map((unit) => unit.property_name))
  // );
  // const uniqueUnitIds = Array.from(
  //   new Set(unitsList.units.map((unit) => unit.unit_number))
  // );
  // const uniqueOwners = Array.from(
  //   new Set(unitsList.units.map((unit) => unit.unitOwner))
  // );
  // const uniqueOccupy = Array.from(
  //   new Set(unitsList.units.map((unit) => unit.occupied))
  // );
  // const uniqueSizes = Array.from(
  //   new Set(unitsList.units.map((unit) => unit.unitSize))
  // );
  // const sortedUniqueSizes = uniqueSizes.sort();

  // to filter
  const filteredUnits = units.filter(
    (unit) =>
      // (unit) =>
      // (selectedProperties.length === 0 ||
      //   selectedProperties.includes(unit.propertyName)) &&
      // (selectedUnitNumbers.length === 0 ||
      //   selectedUnitNumbers.includes(unit.unitNumber)) &&
      // (selectedOwners.length === 0 ||
      //   selectedOwners.includes(unit.unitOwner)) &&
      // (selectedOccupy.length === 0 || selectedOccupy.includes(unit.occupied)) &&
      // (selectedSizes.length === 0 || selectedSizes.includes(unit.unitSize)) &&
      unit.property_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(unit.unit_number).includes(searchTerm) ||
      unit.first_name_owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.last_name_owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.occupied_by.toLowerCase().includes(searchTerm.toLowerCase())
      // || String(unit.unit_size).includes(searchTerm)
  );

  const router = useRouter();

  //route to the edit-unit page
  const handleEditClick = (unitid) => {
    console.log("editing unit with index :", unitid);
    router.push({
      pathname: "/edit-unit",
      query: { unitid: unitid },
    });
  };

  //route to the view-unit page
  const handleViewClick = (unitid) => {
    console.log("viewing unit with index :", unitid);
    router.push({
      pathname: "/view-unit",
      query: { unitid: unitid },
    });
  };

  //route to add a new unit page
  const handleAddUnitClick = (unitId) => {
    router.push("/add-unit");
    console.log("adding new unit");
  };

  const [currentMonth, setCurrentMonth] = useState("");

  useEffect(() => {
    const currentDate = new Date();
    const monthIndex = currentDate.getMonth(); // Month index (0-11)
    const months = [
      "jan_fee__",
      "feb_fee__",
      "mar_fee__",
      "apr_fee__",
      "may_fee__",
      "jun_fee__",
      "jul_fee__",
      "aug_fee__",
      "sep_fee__",
      "oct_fee__",
      "nov_fee__",
      "dec_fee__",
    ];
    setCurrentMonth(months[monthIndex]); // Get the fee property based on the current month
  }, []);

  const CurrentMonthFees = ({ unit, currentMonth }) => {
    let currentFee = "N/A";
    let textColor = "inherit"; // Default color

    if (unit[currentMonth] !== null && unit[currentMonth] !== undefined) {
      console.log("stuff");
      currentFee = unit[currentMonth] ? "Paid" : "Not Paid";
      textColor = unit[currentMonth] ? "green" : "red"; // Set color to green if payed
    }

    return <span style={{ color: textColor }}>{currentFee}</span>;
  };

  return (
    <>
      <Head>
        <script
          id="sc-script"
          src="https://cdn.smartcat-proxy.com/60a29c2d1d4341e38fbb9d3f4a3bef3d/script-v1/__translator.js?hash=7e6e37c59d0bf7e0a6f687b25f488757"
        />
      </Head>
      {/* <Header></Header> */}
      {/* <Container className="units-container" maxWidth={5}> */}
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
                All Units
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
                  onClick={handleAddUnitClick}
                >
                  Add Unit
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box className={styles.unitsBox}>
                {/* filter for properties */}
                {/* <FormControl variant="outlined" sx={{ m: 1, width: 180 }}>
                  <InputLabel >Property Name</InputLabel>
                  <Select
                    inputProps={{ "data-testid": "property-select"}}
                    name="property"
                    multiple
                    value={selectedProperties}
                    onChange={handlePropertyChange}
                    label="Property Name"
                  >
                    {uniqueProperties.map((property, index) => (
                      <MenuItem key={index} value={property}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedProperties.includes(property)}
                            />
                          }
                          label={property}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}

                {/* filter for unit number */}
                {/* <FormControl variant="outlined" sx={{ m: 1, width: 150 }}>
                  <InputLabel>Unit Id</InputLabel>
                  <Select
                    inputProps={{ "data-testid": "unit-select"}}
                    name="unit"
                    multiple
                    value={selectedUnitNumbers}
                    onChange={handleUnitNumberChange}
                    label="Unit Id"
                  >
                    {uniqueUnitIds.map((unitId, index) => (
                      <MenuItem key={index} value={unitId}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedUnitNumbers.includes(unitId)}
                            />
                          }
                          label={unitId}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}

                {/* filter for unit owner */}
                {/* <FormControl variant="outlined" sx={{ m: 1, width: 180 }}>
                  <InputLabel>Unit Owner</InputLabel>
                  <Select
                    inputProps={{ "data-testid": "owner-select"}}
                    name="owner"
                    multiple
                    value={selectedOwners}
                    onChange={handleOwnerChange}
                    label="Unit Owner"
                  >
                    {uniqueOwners.map((owner, index) => (
                      <MenuItem key={index} value={owner}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedOwners.includes(owner)}
                            />
                          }
                          label={owner}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}

                {/* filter for who occupies unit */}
                {/* <FormControl variant="outlined" sx={{ m: 1, width: 180 }}>
                  <InputLabel>Occupied By</InputLabel>
                  <Select
                    inputProps={{ "data-testid": "occupant-select"}}
                    name="occupant"
                    multiple
                    value={selectedOccupy}
                    onChange={handleOccupyChange}
                    label="Occupied By"
                  >
                    {uniqueOccupy.map((occupied, index) => (
                      <MenuItem key={index} value={occupied}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedOccupy.includes(occupied)}
                            />
                          }
                          label={occupied}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}

                {/* filter for size */}
                {/* <FormControl variant="outlined" sx={{ m: 1, width: 150 }}>
                  <InputLabel>Size</InputLabel>
                  <Select
                    inputProps={{ "data-testid": "size-select"}}
                    name="size"
                    multiple
                    value={selectedSizes}
                    onChange={handleSizeChange}
                    label="Size"
                  >
                    {sortedUniqueSizes.map((unitsize, index) => (
                      <MenuItem key={index} value={unitsize}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedSizes.includes(unitsize)}
                            />
                          }
                          label={unitsize}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}

                <TableContainer>
                  <Table className={styles.unitsTable}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <b>Property Name</b>
                        </TableCell>
                        <TableCell>
                          <b>Unit Id</b>
                        </TableCell>
                        <TableCell>
                          <b>Unit Owner</b>
                        </TableCell>
                        <TableCell>
                          <b>Occupied By</b>
                        </TableCell>
                        <TableCell>
                          <b>Unit Size</b>
                        </TableCell>
                        <TableCell>
                          <b>Monthly Fee</b>
                        </TableCell>
                        <TableCell>
                          <b>Fee Status</b>
                        </TableCell>
                        <TableCell>
                          <b>Actions</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* print values from the DB */}
                      {filteredUnits.map((unit, index) => (
                        <TableRow key={index}>
                          <TableCell>{unit.property_name}</TableCell>
                          <TableCell>{unit.unit_number}</TableCell>
                          <TableCell>
                            {unit.first_name_owner}
                            <br />
                            {unit.last_name_owner}
                          </TableCell>
                          <TableCell>{unit.occupied_by}</TableCell>
                          <TableCell>{unit.size} sqft</TableCell>
                          <TableCell>{unit.condo_fee_total}$</TableCell>
                          <TableCell>
                            <CurrentMonthFees
                              unit={unit}
                              currentMonth={currentMonth}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<EditIcon />}
                              style={{ marginBottom: "8px" }}
                              onClick={() => handleEditClick(unit.id)}
                            >
                              Edit
                            </Button>
                            <br />
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<VisibilityIcon />}
                              onClick={() => handleViewClick(unit.id)}
                            >
                              View
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

export default CMCUnits;
