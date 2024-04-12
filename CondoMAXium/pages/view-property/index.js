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

  async function fetchTotalFees(propertyId){
    // Fetch units for the property
    const { data: units, error } = await supabase
      .from('units')
      .select('*')
      .eq('propertyFky', propertyid);

    console.log('units:', units);
    if (error) {
      console.error('Error fetching units:', error);
      return;
    }

    // Calculate total condo fees
    let totalCondoFees = 0;
    units.forEach(unit => {
      totalCondoFees += unit.condo_fee_total;
    });

    console.log('Total condo fees:', totalCondoFees);
  }


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
                  <b></b>
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
              <TableRow>
                <TableCell>
                  <b>Total Paid Fees</b>
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
              <TableRow>
                <TableCell>
                  <b>Percent Paid Fees</b>
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
            </TableBody>
          </Table>
        </TableContainer>
        <br/><br/>
        <Typography sx={{color: 'grey', fontSize: 18}} display="inline">Total Yearly Condo Fees: </Typography>total<br/>
        <Typography sx={{color: 'grey', fontSize: 18}} display="inline">Total Yearly Paid Fees: </Typography>paid<br/>
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