import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import styles from "../../styles/units.module.css";
import supabase from "../../config/supabaseClient";

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
  Typography,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const ViewUnit = () => {
  const [units, setUnits] = useState([]);

  const router = useRouter();

  //fetching units from database
  useEffect(() => {
    async function fetchUnits() {
      try {
        const { data: unitData, error: unitError } = await supabase.from('units').select('*');
        console.log(unitData); // Log fetched data
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

  //route to the edit-unit page
  const handleEditClick = (unitid) => {
    console.log('editing unit with index :', unitid);
    router.push({
      pathname: '/edit-unit',
      query: {unitid:unitid}
    });
  }

  const handleViewClick = (unitId) => {
    // // Store the unit ID in local storage
    // localStorage.setItem('currentUnitId', unitId);
  
    // Navigate to the edit page
    router.push('/units');
  };

  return (
    <Box className={styles.outsideContainer}>
      <Container className={styles.unitsContainer}>
        <Typography variant="h4" gutterBottom className={styles.editUnitsHeader}>
          View Unit
        </Typography>
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{textDecoration: 'underline'}} 
          display="inline" 
          style={{ color:"#333", padding: "2%" }}
        >
          Owner Information
        </Typography>
        <br/><br/>
        {/* Iterating over units and displaying property_name for each */}
        {units.map((unit, index) => (
          <Typography key={index} sx={{ px: 4, fontSize: 20 }}>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Owner Full Name: </Typography>{unit.first_name_owner} {unit.last_name_owner} <br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Owner Email: </Typography> {unit.emailUnit} <br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Owner Phone Number: </Typography> {unit.owner_phone}
          </Typography>
        ))}
        <br/>
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{textDecoration: 'underline'}} 
          display="inline" 
          style={{ color:"#333", padding: "2%" }}
        >
          Tenant Information
        </Typography>
        <br/><br/>
        {units.map((unit, index) => (
          <Typography key={index} sx={{ px: 4, fontSize: 20 }}>
            {unit.first_name_tenant || unit.last_name_tenant || unit.tenant_email || unit.tenant_phone ? (
              <div>
                <Typography>Tenant Full Name: {unit.first_name_tenant} {unit.last_name_tenant}</Typography>
                <Typography>Tenant Email: {unit.tenant_email}</Typography>
                <Typography>Tenant Phone Number: {unit.tenant_phone}</Typography>
              </div>
            ) : (
              <Typography sx={{ px: 4, fontSize: 20 }}>
                No tenant
              </Typography>
            )}
          </Typography>
        ))}

        <br/>
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{textDecoration: 'underline'}} 
          display="inline" 
          style={{ color:"#333", padding: "2%" }}
        >
          Unit Information
        </Typography>
        <br/><br/>

        {units.map((unit, index) => (
        <Box>
          <Typography key={index} sx={{ px: 4, fontSize: 20 }}>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Property Name: </Typography> {unit.property_name} <br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Unit Number: </Typography>{unit.unit_number} <br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Parking Number: </Typography>{unit.parking_number} <br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Locker Number: </Typography>{unit.locker_number} <br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Unit Occupied By: </Typography>{unit.occupied_by} <br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Unit Size: </Typography>{unit.size} sqft <br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Condo Fee/SQFT: </Typography>{unit.condo_fee_sqft}$<br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Condo Parking Fee: </Typography>{unit.parking_fee}$<br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Condo Total Fee: </Typography>{unit.condo_fee_total}$<br/>
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
            Bellow is displayed which montly total condo fee has been paid:
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
                <TableRow key={index}>
                  <TableCell style={{ color: unit.jan_fee ? 'green' : 'red' }}>
                    {unit.jan_fee ? 'Paid' : 'Not Paid'}
                    </TableCell>
                    <TableCell style={{ color: unit.feb_fee ? 'green' : 'red' }}>
                    {unit.feb_fee ? 'Paid' : 'Not Paid'}
                    </TableCell>
                    <TableCell style={{ color: unit.mar_fee ? 'green' : 'red' }}>
                    {unit.mar_fee ? 'Paid' : 'Not Paid'}
                    </TableCell>
                    <TableCell style={{ color: unit.apr_fee ? 'green' : 'red' }}>
                    {unit.apr_fee ? 'Paid' : 'Not Paid'}
                    </TableCell>
                    <TableCell style={{ color: unit.may_fee ? 'green' : 'red' }}>
                    {unit.may_fee ? 'Paid' : 'Not Paid'}
                    </TableCell>
                    <TableCell style={{ color: unit.jun_fee ? 'green' : 'red' }}>
                    {unit.jun_fee ? 'Paid' : 'Not Paid'}
                    </TableCell>
                    <TableCell style={{ color: unit.jul_fee ? 'green' : 'red' }}>
                    {unit.jul_fee ? 'Paid' : 'Not Paid'}
                    </TableCell>
                    <TableCell style={{ color: unit.aug_fee ? 'green' : 'red' }}>
                    {unit.aug_fee ? 'Paid' : 'Not Paid'}
                    </TableCell>
                    <TableCell style={{ color: unit.sep_fee ? 'green' : 'red' }}>
                    {unit.sep_fee ? 'Paid' : 'Not Paid'}
                    </TableCell>
                    <TableCell style={{ color: unit.oct_fee ? 'green' : 'red' }}>
                    {unit.oct_fee ? 'Paid' : 'Not Paid'}
                    </TableCell>
                    <TableCell style={{ color: unit.nov_fee ? 'green' : 'red' }}>
                    {unit.nov_fee ? 'Paid' : 'Not Paid'}
                    </TableCell>
                    <TableCell style={{ color: unit.dec_fee ? 'green' : 'red' }}>
                    {unit.dec_fee ? 'Paid' : 'Not Paid'}
                    </TableCell>
                </TableRow>
              </TableBody> 
            </Table>
          </TableContainer>
          <br/><br/>
          <Grid container spacing={2}>
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
          </Grid>
        </Box>
        ))}


      </Container>
    </Box>


  );
};

export default ViewUnit;