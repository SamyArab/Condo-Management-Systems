// ProfilePage.tsx
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useRouter } from "next/router";


import {
  Box,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import supabase from "../../config/supabaseClient";
import "../../styles/units.module.css";


const unitsList = {
  units: [
    {
      propertyName: "Mason Building",
      unitNumber: 101,
      unitOwner: "Maurine Thatcher",
      occupied: "Owner",
      unitSize: "900sqft",
    },
    {
      propertyName: "Mason Building",
      unitNumber: 102,
      unitOwner: "Maurine Thatcher",
      occupied: "Tenant",
      unitSize: "800sqft",
    },
    {
      propertyName: "Mason Building",
      unitNumber: 103,
      unitOwner: "Jack Brown",
      occupied: "Owner",
      unitSize: "830sqft",
    },
    {
      propertyName: "Mason Building",
      unitNumber: 104,
      unitOwner: "Lily Aldrin",
      occupied: "Tenant",
      unitSize: "800sqft",
    },
    {
      propertyName: "Write Building",
      unitNumber: 101,
      unitOwner: "Ted Mosby",
      occupied: "Owner",
      unitSize: "850sqft",
    },
    {
      propertyName: "Write Building",
      unitNumber: 102,
      unitOwner: "Marshall Ericson",
      occupied: "Tenant",
      unitSize: "850sqft",
    },
    {
      propertyName: "Write Building",
      unitNumber: 103,
      unitOwner: "Barney Stinson",
      occupied: "Tenant",
      unitSize: "850sqft",
    },
  ],
};

const CMCUnits = () => {
  const [units, setUnits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  //fetching units from database
  useEffect(() => {
    async function fetchUnits() {
      try {
        const { data, error } = await supabase.from('units').select('*');
        if (error) {
          throw error;
        }
        setUnits(data);
      } catch (error) {
        console.log("Error fetching units", error.message);
      }
    }
    
    fetchUnits();
  }, []);



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
    setSelectedProperties(event.target.value);
  };

  //to handle unit number filter
  const handleUnitNumberChange = (event) => {
    setSelectedUnitNumbers(event.target.value);
  };

  //to handle owner filter
  const handleOwnerChange = (event) => {
    setSelectedOwners(event.target.value);
  };

  //to handle owner filter
  const handleOccupyChange = (event) => {
    setSelectedOccupy(event.target.value);
  };

  //to handle owner filter
  const handleSizeChange = (event) => {
    setSelectedSizes(event.target.value);
  };

  //to not repeat values in filter
  const uniqueProperties = Array.from(
    new Set(unitsList.units.map((unit) => unit.property_name))
  );
  const uniqueUnitIds = Array.from(
    new Set(unitsList.units.map((unit) => unit.unit_number))
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
  const router = useRouter();

  //route to the edit-unit page
  const handleEditClick = (unitid) => {
    console.log('editing unit with index :', unitid);
    router.push({
      pathname: '/edit-unit',
      query: {unitid:unitid}
    });
  }

  //route to add a new unit page
  const handleAddUnitClick = (unitId) => {
    console.log('adding new unit');
    router.push("/add-unit");
  }

  return (
    <>
      {/* <Header></Header> */}
      <Box className="outside-container">
        <Container className="units-container" maxWidth={5}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h4" component="h1" className="units-header">
                All Units
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} className="search-grid">
              <Box className="search-box">
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
              <Box className="units-box">
                {/* filter for properties */}
                <FormControl variant="outlined" sx={{ m: 1, width: 180 }}>
                  <InputLabel>Property Name</InputLabel>
                  <Select
                    data-testid="property-filter"
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
                    multiple
                    //ignore value error here, still works
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
                <FormControl
                  data-testid="owner-filter"
                  variant="outlined"
                  sx={{ m: 1, width: 180 }}
                >
                  <InputLabel>Unit Owner</InputLabel>
                  <Select
                    multiple
                    //ignore value error here, still works
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
                    multiple
                    //ignore value error here, still works
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
                  <Table className="units-table">
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
                        <TableCell>
                          <b>Parking Number</b>
                        </TableCell>
                        <TableCell>
                          <b>Locker Number</b>
                        </TableCell>
                        <TableCell>
                          <b>Condo Fee</b>
                        </TableCell>

                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {/* print values from the DB */}
                    {units.map((unit, index) => (
                          <TableRow key={index}>
                            <TableCell>{unit.property_name}</TableCell>
                            <TableCell>{unit.unit_number}</TableCell>
                            <TableCell>{unit.unit_owner}</TableCell>
                            <TableCell>{unit.occupied_by}</TableCell>
                            <TableCell>{unit.size}</TableCell>
                            <TableCell>{unit.parking_number}</TableCell>
                            <TableCell>{unit.locker_number}</TableCell>
                            <TableCell>{unit.condo_fee}</TableCell>
                            <TableCell>
                              <button onClick={() => handleEditClick(unit.id)}>Edit Unit</button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody> 
                  </Table>
                </TableContainer>
                <button id="centeredButton" onClick={handleAddUnitClick} style={{ display: 'block', margin: 'auto', marginTop: '20px' }}>Add Unit</button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default CMCUnits;
