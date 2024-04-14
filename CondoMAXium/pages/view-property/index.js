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

  const router = useRouter();

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
  });

  const [units, setUnits] = useState([]);

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
          });
          fetchUnits(propertyid);
        } 
        else {
          console.log('Unit not found');
        }
      } catch (error) {
        console.error('Error fetching unit', error.message);
      }
    }
    const fetchUnits = async (propertyId) => {
      const { data: unitsData, error } = await supabase
        .from('units')
        .select('*')
        .eq('propertyFky', propertyId);

      if (error) {
        console.error('Error fetching units', error);
        return;
      }
      
      setUnits(unitsData);
    };

    if (propertyid) {
      fetchProperty();
    }
  }, [propertyid]);

  // //route to the edit-unit page
  // const handleEditClick = (propertyid) => {
  //   console.log('editing unit with index :', propertyid);
  //   router.push({
  //     // pathname: '/edit-property',
  //     query: {propertyid:propertyid}
  //   });
  // }
  
  const handleViewClick = (propertyId) => {
    // Navigate to the edit page
    router.push('/units');
  };

  const totalMonthlyFees = units.reduce((acc, unit) => {
    Object.keys(unit).forEach(key => {
      if (key.includes('_fee__')) {
        if (unit[key] == null) {
          acc[key] = 0;
        }
        if (unit[key] !== null) {
          acc[key] = (acc[key] || 0) + (unit.condo_fee_total);
        }
      }
    });
    return acc;
  }, {});

  const sumOfTotalMonthlyFees = Object.values(totalMonthlyFees).reduce((acc, fee) => acc + fee, 0);

  const paidMonthlyFees = units.reduce((acc, unit) => {
    Object.keys(unit).forEach(key => {
      if (key.includes('_fee__')) {
      if (unit.condo_fee_total === 0) {
        acc[key] = NaN;
      } else {
        acc[key] = (acc[key] || 0) + (unit[key]*unit.condo_fee_total);
      }
      }
    });
    return acc;
  }, {});

  const sumOfPaidMonthlyFees = Object.values(paidMonthlyFees).reduce((acc, fee) => acc + fee, 0);

  const percentPaidFees = Object.keys(totalMonthlyFees).reduce((acc, key) => {
    acc[key] = ((paidMonthlyFees[key] / totalMonthlyFees[key]) * 100.0).toFixed(2);
    return acc;
  } , {});

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
        <TableContainer>
          <Table className={styles.unitsTable}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Month</b>
                </TableCell>
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
                <TableCell>
                  <b>Total Property Fees</b>
                </TableCell>
                {Object.values(totalMonthlyFees).map((total, index) => (
                  <TableCell key={index}>{total}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>
                  <b>Total Paid Fees</b>
                </TableCell>
                {Object.values(paidMonthlyFees).map((total, index) => (
                  <TableCell key={index}>{total}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>
                  <b>Percent Paid Fees</b>
                </TableCell>
                {Object.values(percentPaidFees).map((total, index) => (
                  <TableCell key={index}>{total}</TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <br/><br/>
        <Typography sx={{color: 'grey', fontSize: 18}} display="inline">Total Yearly Condo Fees: </Typography>{sumOfTotalMonthlyFees}<br/>
        <Typography sx={{color: 'grey', fontSize: 18}} display="inline">Total Yearly Paid Fees: </Typography>{sumOfPaidMonthlyFees}<br/>
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
      </Container>
    </Box>
  );
};

export default ViewProperty;