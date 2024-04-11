import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import styles from "../../styles/units.module.css";
import supabase from "../../config/supabaseClient";

import {
  Button,
  Container,
  Grid,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const ViewProperty = () => {
  //A copy of unit used for comparing changes
  const [propertyCopy, setPropertyCopy] = useState({...property});

  const router = useRouter();

  // const [month, setMonth] = useState('');

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  const { propertyid } = router.query;
  console.log("we're workig on propertyid: ", propertyid)
  //initialize unit object to save fetched data 
  const [property, setProperty] = useState({

    property_name: '',
    units_count: '',
    parking_count: '',
    locker_count: '',
    year_built: '',
    province: '',
    postal_code: '',
    street_address: '',

    // condo_fee_total: '',
    // parking_number: '',
    // locker_number: '',
    // jan_fee: '',
    // feb_fee: '',
    // mar_fee: '',
    // apr_fee: '',
    // may_fee: '',
    // jun_fee: '',
    // jul_fee: '',
    // aug_fee: '',
    // sep_fee: '',
    // oct_fee: '',
    // nov_fee: '',
    // dec_fee: '',
  });

  //fetch data from DB
  useEffect(() => {
    async function fetchProperty() {
      try {
        const { data, error } = await supabase.from('properties').select('*').eq('propertyId', propertyid);
        if (error) {
          throw error;
        }
        if (data && data.length > 0) {
          const fetchedProperty = data[0];
          setProperty({
            property_name: fetchedProperty.buildingName || '',
            units_count: fetchedProperty.unitsCount || '',
            parking_count: fetchedProperty.parkingCount || '',
            locker_count: fetchedProperty.lockerCount || '',
            year_built: fetchedProperty.yearBuilt || '',
            province: fetchedProperty.province || '',
            postal_code: fetchedProperty.postalCode || '',
            street_address: fetchedProperty.street || '',

            // condo_fee_total: fetchedProperty.condo_fee_total || '',         
            // parking_number: fetchedProperty.parking_number || '',
            // locker_number: fetchedProperty.locker_number || '',
            // jan_fee: fetchedProperty.jan_fee ,
            // feb_fee: fetchedProperty.feb_fee ,
            // mar_fee: fetchedProperty.mar_fee ,
            // apr_fee: fetchedProperty.apr_fee ,
            // may_fee: fetchedProperty.may_fee ,
            // jun_fee: fetchedProperty.jun_fee ,
            // jul_fee: fetchedProperty.jul_fee ,
            // aug_fee: fetchedProperty.aug_fee ,
            // sep_fee: fetchedProperty.sep_fee ,
            // oct_fee: fetchedProperty.oct_fee ,
            // nov_fee: fetchedProperty.nov_fee ,
            // dec_fee: fetchedProperty.dec_fee ,
          });
          setPropertyCopy({
            jan_fee: fetchedProperty.jan_fee ,
            feb_fee: fetchedProperty.feb_fee ,
            mar_fee: fetchedProperty.mar_fee ,
            apr_fee: fetchedProperty.apr_fee ,
            may_fee: fetchedProperty.may_fee ,
            jun_fee: fetchedProperty.jun_fee ,
            jul_fee: fetchedProperty.jul_fee ,
            aug_fee: fetchedProperty.aug_fee ,
            sep_fee: fetchedProperty.sep_fee ,
            oct_fee: fetchedProperty.oct_fee ,
            nov_fee: fetchedProperty.nov_fee ,
            dec_fee: fetchedProperty.dec_fee ,
          });
        } 
        else {
          console.log('Unit not found');
        }
      } catch (error) {
        console.error('Error fetching unit', error.message);
      }
    }
  
    if (propertyid) {
      fetchProperty();
    }
  }, [propertyid]);

//   const handlePaymentChange = async () => {
//     const monthMap = {
//       1: 'jan_fee',
//       2: 'feb_fee',
//       3: 'mar_fee',
//       4: 'apr_fee',
//       5: 'may_fee',
//       6: 'jun_fee',
//       7: 'jul_fee',
//       8: 'aug_fee',
//       9: 'sep_fee',
//       10: 'oct_fee',
//       11: 'nov_fee',
//       12: 'dec_fee',
//     };
  
//     const selectedMonthKey = monthMap[month];
//     if (selectedMonthKey) {
//       const updatedStatus = unit[selectedMonthKey] ? false : true;
  
//       // Update local state
//       setProperty({
//         ...unit,
//         [selectedMonthKey]: updatedStatus,
//       });
  
//       // If necessary, update unitCopy state as well
//       setPropertyCopy({
//         ...unitCopy,
//         [selectedMonthKey]: updatedStatus,
//       });
  
//       // Update in database
//       try {
//         const { error } = await supabase
//           .from('propertiess')
//           .update({ [selectedMonthKey]: updatedStatus })
//           .eq('id', propertyid);  // Ensure you have the correct unique identifier for the unit
  
//         if (error) throw error;
  
//         console.log('Update successful');
//       } catch (error) {
//         console.error('Error updating property', error.message);
//       }
//     } else {
//       console.log("No month selected or invalid month value");
//     }
//   };
  
  

  //route to the edit-unit page
  const handleEditClick = (propertyid) => {
    console.log('editing unit with index :', propertyid);
    router.push({
      // pathname: '/edit-property',
      query: {propertyid:propertyid}
    });
  }

  const handleViewClick = (propertyId) => {
    // Navigate to the edit page
    router.push('/units');
  };

  return (
    <Box className={styles.outsideContainer}>
      <Container className={styles.unitsContainer}>
        <Typography variant="h4" gutterBottom className={styles.editUnitsHeader}>
          View Property
        </Typography>
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{textDecoration: 'underline'}} 
          display="inline" 
          style={{ color:"#333", padding: "2%" }}
        >
          Property Information
        </Typography>
        <br/><br/>
        {/* Iterating over properties and displaying property_name for each */}
          <Typography sx={{ px: 4, fontSize: 20 }}>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Building Name: </Typography>{property.property_name} <br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Address: </Typography> {property.street_address} <br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Postal Code: </Typography> {property.postal_code} <br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Province: </Typography> {property.province} <br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Year Built: </Typography> {property.year_built} <br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Unit Count: </Typography> {property.units_count} <br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Parking Count: </Typography> {property.parking_count} <br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Locker Count: </Typography> {property.locker_count} <br/>
          </Typography>
        <br/>
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{textDecoration: 'underline'}} 
          display="inline" 
          style={{ color:"#333", padding: "2%" }}
        >
          Financial Information
        </Typography>
        <br/><br/>

        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{textDecoration: 'underline'}} 
          display="inline" 
          style={{ color:"#333", padding: "2%" }}
          onClick={handleViewClick}
        >
          View Units in Property
        </Typography>
        <br/><br/>

        {/* <Box>
          <Typography sx={{ px: 4, fontSize: 20 }}>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Property Name: </Typography> {unit.property_name} <br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Unit Number: </Typography>{unit.unit_number} <br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Parking Number: </Typography>{unit.parking_number} <br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Locker Number: </Typography>{unit.locker_number} <br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Unit Occupied By: </Typography>{unit.occupied_by} <br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Unit Size: </Typography>{unit.size} sqft <br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Condo Fee/SQFT: </Typography>{unit.condo_fee_sqft}$<br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Condo Parking Fee: </Typography>{unit.parking_fee}$<br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Condo Total Monthly Fee: </Typography>{unit.condo_fee_total}$<br/>
          </Typography>
          <br/><br/>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{textDecoration: 'underline'}} 
            display="inline" 
            style={{ color:"#333", padding: "2%" }}
          >
            Finance Information
          </Typography>
          <br/><br/>
          <Typography sx={{ pl: 3}}>
            Below is displayed which montly total condo fee has been paid:
          </Typography>
          <br/>
          <TableContainer>
            <Table className={styles.unitsTable}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Jan</b>
                  </TableCell>
                  <TableCell>
                    <b>Feb</b>
                  </TableCell>
                  <TableCell>
                    <b>Mar</b>
                  </TableCell>
                  <TableCell>
                    <b>Apr</b>
                  </TableCell>
                  <TableCell>
                    <b>May</b>
                  </TableCell>
                  <TableCell>
                    <b>Jun</b>
                  </TableCell>
                  <TableCell>
                    <b>Jul</b>
                  </TableCell>
                  <TableCell>
                    <b>Aug</b>
                  </TableCell>
                  <TableCell>
                    <b>Sep</b>
                  </TableCell>
                  <TableCell>
                    <b>Oct</b>
                  </TableCell>
                  <TableCell>
                    <b>Nov</b>
                  </TableCell>
                  <TableCell>
                    <b>Dec</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell style={{ color: unit.jan_fee === null ? 'inherit' : (unit.jan_fee ? 'green' : 'red') }}>
                    {unit.jan_fee === null ? 'N/A' : (unit.jan_fee ? 'Paid' : 'Not Paid')}
                  </TableCell>
                  <TableCell style={{ color: unit.feb_fee === null ? 'inherit' : (unit.feb_fee ? 'green' : 'red') }}>
                    {unit.feb_fee === null ? 'N/A' : (unit.feb_fee ? 'Paid' : 'Not Paid')}
                  </TableCell>
                  <TableCell style={{ color: unit.mar_fee === null ? 'inherit' : (unit.mar_fee ? 'green' : 'red') }}>
                    {unit.mar_fee === null ? 'N/A' : (unit.mar_fee ? 'Paid' : 'Not Paid')}
                  </TableCell>
                  <TableCell style={{ color: unit.apr_fee === null ? 'inherit' : (unit.apr_fee ? 'green' : 'red') }}>
                    {unit.apr_fee === null ? 'N/A' : (unit.apr_fee ? 'Paid' : 'Not Paid')}
                  </TableCell>
                  <TableCell style={{ color: unit.may_fee === null ? 'inherit' : (unit.may_fee ? 'green' : 'red') }}>
                    {unit.may_fee === null ? 'N/A' : (unit.may_fee ? 'Paid' : 'Not Paid')}
                  </TableCell>
                  <TableCell style={{ color: unit.jun_fee === null ? 'inherit' : (unit.jun_fee ? 'green' : 'red') }}>
                    {unit.jun_fee === null ? 'N/A' : (unit.jun_fee ? 'Paid' : 'Not Paid')}
                  </TableCell>
                  <TableCell style={{ color: unit.jul_fee === null ? 'inherit' : (unit.jul_fee ? 'green' : 'red') }}>
                    {unit.jul_fee === null ? 'N/A' : (unit.jul_fee ? 'Paid' : 'Not Paid')}
                  </TableCell>
                  <TableCell style={{ color: unit.aug_fee === null ? 'inherit' : (unit.aug_fee ? 'green' : 'red') }}>
                    {unit.aug_fee === null ? 'N/A' : (unit.aug_fee ? 'Paid' : 'Not Paid')}
                  </TableCell>
                  <TableCell style={{ color: unit.sep_fee === null ? 'inherit' : (unit.sep_fee ? 'green' : 'red') }}>
                    {unit.sep_fee === null ? 'N/A' : (unit.sep_fee ? 'Paid' : 'Not Paid')}
                  </TableCell>
                  <TableCell style={{ color: unit.oct_fee === null ? 'inherit' : (unit.oct_fee ? 'green' : 'red') }}>
                    {unit.oct_fee === null ? 'N/A' : (unit.oct_fee ? 'Paid' : 'Not Paid')}
                  </TableCell>
                  <TableCell style={{ color: unit.nov_fee === null ? 'inherit' : (unit.nov_fee ? 'green' : 'red') }}>
                    {unit.nov_fee === null ? 'N/A' : (unit.nov_fee ? 'Paid' : 'Not Paid')}
                  </TableCell>
                  <TableCell style={{ color: unit.dec_fee === null ? 'inherit' : (unit.dec_fee ? 'green' : 'red') }}>
                    {unit.dec_fee === null ? 'N/A' : (unit.dec_fee ? 'Paid' : 'Not Paid')}
                  </TableCell>
                </TableRow>
              </TableBody> 
            </Table>
          </TableContainer>
          <br/><br/>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <Typography sx={{ pl: 3}}>I want to confirm a payment for the month of:</Typography>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel id="month-select-label">Month</InputLabel>
                <Select
                  labelId="month-select-label"
                  id="month-select"
                  value={month}
                  label="Month"
                  name="Month"
                  onChange={handleChange}
                >
                  <MenuItem value={1}>January</MenuItem>
                  <MenuItem value={2}>February</MenuItem>
                  <MenuItem value={3}>March</MenuItem>
                  <MenuItem value={4}>April</MenuItem>
                  <MenuItem value={5}>May</MenuItem>
                  <MenuItem value={6}>June</MenuItem>
                  <MenuItem value={7}>July</MenuItem>
                  <MenuItem value={8}>August</MenuItem>
                  <MenuItem value={9}>September</MenuItem>
                  <MenuItem value={10}>October</MenuItem>
                  <MenuItem value={11}>November</MenuItem>
                  <MenuItem value={12}>December</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <br/><br/>
          <Grid container spacing={3}>
            <Grid item xs={2}>
              <Button 
                variant="contained" 
                size="large"
                startIcon={<ArrowBackIosNewIcon />}
                sx={{ my: 1, ml: 5 }} 
                onClick={() => handleViewClick(unit.id)}
              >
                Back
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button 
                variant="contained" 
                size="large"
                startIcon={<EditIcon />}
                sx={{ my: 1, ml: 5 }} 
                onClick={() => handleEditClick(unit.id)}
              >
                Edit
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button 
                variant="contained" 
                size="large"
                sx={{ my: 1, ml: 5 }} 
                // onClick={handlePaymentChange}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Box> */}


      </Container>
    </Box>


  );
};

export default ViewProperty;