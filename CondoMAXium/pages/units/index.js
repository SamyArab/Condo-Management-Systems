// ProfilePage.tsx
// import Header from "../../components/layout/Header";
import React, { useState } from "react";

import {
  Typography,
  Container,
  Box, 
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControlLabel,
} from "@mui/material";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import styles from "../../styles/units.module.css";

//mockup list of units, to be changed when adding backend
const unitsList = {
  units: [
    {
      propertyName: "Mason Building",
      unitNumber: "101",
      unitOwner: "Maurine Thatcher",
      occupied: "Owner",
      unitSize: "900sqft",
    },
    {
      propertyName: "Mason Building",
      unitNumber: "102",
      unitOwner: "Maurine Thatcher",
      occupied: "Tenant",
      unitSize: "800sqft",
    },
    {
      propertyName: "Mason Building",
      unitNumber: "103",
      unitOwner: "Jack Brown",
      occupied: "Owner",
      unitSize: "830sqft",
    },
    {
      propertyName: "Mason Building",
      unitNumber: "104",
      unitOwner: "Lily Aldrin",
      occupied: "Tenant",
      unitSize: "800sqft",
    },
    {
      propertyName: "Write Building",
      unitNumber: "101",
      unitOwner: "Ted Mosby",
      occupied: "Owner",
      unitSize: "850sqft",
    },
    {
      propertyName: "Write Building",
      unitNumber: "102",
      unitOwner: "Marshall Ericson",
      occupied: "Tenant",
      unitSize: "850sqft",
    },
    {
      propertyName: "Write Building",
      unitNumber: "103",
      unitOwner: "Barney Stinson",
      occupied: "Tenant",
      unitSize: "850sqft",
    },
  ],
};

const CMCUnits = () => {
  //for search bar
  const [searchTerm, setSearchTerm] = useState("");

  //for filters
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [selectedUnitNumbers, setSelectedUnitNumbers] = useState([]);
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [selectedOccupy, setSelectedOccupy] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  //to handle search bar
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  //to handle property filter
  const handlePropertyChange = (event) => {
    const value = Array.isArray(event.target.value) ? event.target.value : [event.target.value];
    setSelectedProperties(value);
  };

  //to handle unit number filter
  const handleUnitNumberChange = (event) => {
    const value = Array.isArray(event.target.value) ? event.target.value : [event.target.value];
    setSelectedUnitNumbers(value);
  };

  //to handle owner filter
  const handleOwnerChange = (event) => {
    const value = Array.isArray(event.target.value) ? event.target.value : [event.target.value];
    setSelectedOwners(value);
  };

  //to handle owner filter
  const handleOccupyChange = (event) => {
    const value = Array.isArray(event.target.value) ? event.target.value : [event.target.value];
    setSelectedOccupy(value);
  };

  //to handle owner filter
  const handleSizeChange = (event) => {
    const value = Array.isArray(event.target.value) ? event.target.value : [event.target.value];
    setSelectedSizes(value);
  };

  //to not repeat values in filter
  const uniqueProperties = Array.from(
    new Set(unitsList.units.map((unit) => unit.propertyName))
  );
  const uniqueUnitIds = Array.from(
    new Set(unitsList.units.map((unit) => unit.unitNumber))
  );
  const uniqueOwners = Array.from(
    new Set(unitsList.units.map((unit) => unit.unitOwner))
  );
  const uniqueOccupy = Array.from(
    new Set(unitsList.units.map((unit) => unit.occupied))
  );
  const uniqueSizes = Array.from(
    new Set(unitsList.units.map((unit) => unit.unitSize))
  );
  const sortedUniqueSizes = uniqueSizes.sort();

  //to filter
  const filteredUnits = unitsList.units.filter(
    (unit) =>
      (selectedProperties.length === 0 ||
        selectedProperties.includes(unit.propertyName)) &&
      (selectedUnitNumbers.length === 0 ||
        selectedUnitNumbers.includes(unit.unitNumber)) &&
      (selectedOwners.length === 0 ||
        selectedOwners.includes(unit.unitOwner)) &&
      (selectedOccupy.length === 0 || selectedOccupy.includes(unit.occupied)) &&
      (selectedSizes.length === 0 || selectedSizes.includes(unit.unitSize)) &&
      (unit.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(unit.unitNumber).includes(searchTerm) ||
        unit.unitOwner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.occupied.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.unitSize.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      {/* <Header></Header> */}
      <Box className={styles.outsideContainer}>
        <Container className={styles.unitsContainer} 
                   maxWidth="sm">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h4" component="h1" className={styles.unitsHeader}>
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
            </Grid>

            <Grid item xs={12}>
              <Box className={styles.unitsBox}>
                {/* filter for properties */}
                <FormControl variant="outlined" sx={{ m: 1, width: 180 }}>
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
                </FormControl>

                {/* filter for unit number */}
                <FormControl variant="outlined" sx={{ m: 1, width: 150 }}>
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
                </FormControl>

                {/* filter for unit owner */}
                <FormControl variant="outlined" sx={{ m: 1, width: 180 }}>
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
                </FormControl>

                {/* filter for who occupies unit */}
                <FormControl variant="outlined" sx={{ m: 1, width: 180 }}>
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
                </FormControl>

                {/* filter for size */}
                <FormControl variant="outlined" sx={{ m: 1, width: 150 }}>
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
                </FormControl>

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
                          <b>Size</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {filteredUnits.map((unit, index) => (
                        <TableRow key={index}>
                          <TableCell>{unit.propertyName}</TableCell>
                          <TableCell>{unit.unitNumber}</TableCell>
                          <TableCell>{unit.unitOwner}</TableCell>
                          <TableCell>{unit.occupied}</TableCell>
                          <TableCell>{unit.unitSize}</TableCell>
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
