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

const ViewUnit = () => {
  //A copy of unit used for comparing changes
  const [unitCopy, setUnitCopy] = useState({...unit});

  const router = useRouter();

  const [month, setMonth] = useState('');

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  const { unitid } = router.query;
  console.log("we're workig on unitid: ", unitid)
  //initialize unit object to save fetched data 
  const [unit, setUnit] = useState({
    property_name: '',
    unit_number: '',
    first_name_owner: '',
    last_name_owner: '',
    emailUnit: '',
    owner_phone: '',
    first_name_tenant: '',
    last_name_tenant: '',
    tenant_email: '',
    tenant_phone: '',
    occupied_by: '',
    size: '',
    condo_fee_sqft: '',
    parking_fee: '',
    condo_fee_total: '',
    parking_number: '',
    locker_number: '',
    jan_fee: '',
    feb_fee: '',
    mar_fee: '',
    apr_fee: '',
    may_fee: '',
    jun_fee: '',
    jul_fee: '',
    aug_fee: '',
    sep_fee: '',
    oct_fee: '',
    nov_fee: '',
    dec_fee: '',
  });

  //fetch data from DB
  useEffect(() => {
    async function fetchUnit() {
      try {
        const { data, error } = await supabase.from('units').select('*').eq('id', unitid);
        if (error) {
          throw error;
        }
        if (data && data.length > 0) {
          const fetchedUnit = data[0];
          setUnit({
            property_name: fetchedUnit.property_name || '',
            unit_number: fetchedUnit.unit_number || '',
            first_name_owner: fetchedUnit.first_name_owner || '',
            last_name_owner: fetchedUnit.last_name_owner || '',
            emailUnit: fetchedUnit.emailUnit || '',
            owner_phone: fetchedUnit.owner_phone || '',
            first_name_tenant: fetchedUnit.first_name_tenant || '',
            last_name_tenant: fetchedUnit.last_name_tenant || '',
            tenant_email: fetchedUnit.tenant_email || '',
            tenant_phone: fetchedUnit.tenant_phone || '',
            occupied_by: fetchedUnit.occupied_by || '',
            size: fetchedUnit.size || '',
            condo_fee_sqft: fetchedUnit.condo_fee_sqft || '',
            parking_fee: fetchedUnit.parking_fee || '',   
            condo_fee_total: fetchedUnit.condo_fee_total || '',         
            parking_number: fetchedUnit.parking_number || '',
            locker_number: fetchedUnit.locker_number || '',
            jan_fee: fetchedUnit.jan_fee ,
            feb_fee: fetchedUnit.feb_fee ,
            mar_fee: fetchedUnit.mar_fee ,
            apr_fee: fetchedUnit.apr_fee ,
            may_fee: fetchedUnit.may_fee ,
            jun_fee: fetchedUnit.jun_fee ,
            jul_fee: fetchedUnit.jul_fee ,
            aug_fee: fetchedUnit.aug_fee ,
            sep_fee: fetchedUnit.sep_fee ,
            oct_fee: fetchedUnit.oct_fee ,
            nov_fee: fetchedUnit.nov_fee ,
            dec_fee: fetchedUnit.dec_fee ,
          });
          setUnitCopy({
            jan_fee: fetchedUnit.jan_fee ,
            feb_fee: fetchedUnit.feb_fee ,
            mar_fee: fetchedUnit.mar_fee ,
            apr_fee: fetchedUnit.apr_fee ,
            may_fee: fetchedUnit.may_fee ,
            jun_fee: fetchedUnit.jun_fee ,
            jul_fee: fetchedUnit.jul_fee ,
            aug_fee: fetchedUnit.aug_fee ,
            sep_fee: fetchedUnit.sep_fee ,
            oct_fee: fetchedUnit.oct_fee ,
            nov_fee: fetchedUnit.nov_fee ,
            dec_fee: fetchedUnit.dec_fee ,
          });
        } 
        else {
          console.log('Unit not found');
        }
      } catch (error) {
        console.error('Error fetching unit', error.message);
      }
    }
  
    if (unitid) {
      fetchUnit();
    }
  }, [unitid]);

  const handlePaymentChange = async () => {
    const monthMap = {
      1: 'jan_fee',
      2: 'feb_fee',
      3: 'mar_fee',
      4: 'apr_fee',
      5: 'may_fee',
      6: 'jun_fee',
      7: 'jul_fee',
      8: 'aug_fee',
      9: 'sep_fee',
      10: 'oct_fee',
      11: 'nov_fee',
      12: 'dec_fee',
    };
  
    const selectedMonthKey = monthMap[month];
    if (selectedMonthKey) {
      const updatedStatus = unit[selectedMonthKey] ? false : true;
  
      // Update local state
      setUnit({
        ...unit,
        [selectedMonthKey]: updatedStatus,
      });
  
      // If necessary, update unitCopy state as well
      setUnitCopy({
        ...unitCopy,
        [selectedMonthKey]: updatedStatus,
      });
  
      // Update in database
      try {
        const { error } = await supabase
          .from('units')
          .update({ [selectedMonthKey]: updatedStatus })
          .eq('id', unitid);  // Ensure you have the correct unique identifier for the unit
  
        if (error) throw error;
  
        console.log('Update successful');
      } catch (error) {
        console.error('Error updating unit', error.message);
      }
    } else {
      console.log("No month selected or invalid month value");
    }
  };
  
  

  //route to the edit-unit page
  const handleEditClick = (unitid) => {
    console.log('editing unit with index :', unitid);
    router.push({
      pathname: '/edit-unit',
      query: {unitid:unitid}
    });
  }

  const handleViewClick = (unitId) => {
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
          <Typography sx={{ px: 4, fontSize: 20 }}>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Owner Full Name: </Typography>{unit.first_name_owner} {unit.last_name_owner} <br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Owner Email: </Typography> {unit.emailUnit} <br/>
            <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Owner Phone Number: </Typography> {unit.owner_phone}
          </Typography>
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
            {unit.first_name_tenant || unit.last_name_tenant || unit.tenant_email || unit.tenant_phone ? (
              <Typography sx={{ px: 4, fontSize: 20 }}>
                <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Tenant Full Name: </Typography>{unit.first_name_tenant} {unit.last_name_tenant}<br/>
                <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Tenant Email:  </Typography>{unit.tenant_email}<br/>
                <Typography sx={{color: 'grey', fontSize: 15}} display="inline">Tenant Phone Number: </Typography>{unit.tenant_phone}
              </Typography>
            ) : (
              <Typography sx={{ px: 4, fontSize: 20 }}>
                No tenant
              </Typography>
            )}
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

        <Box>
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
                onClick={handlePaymentChange}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Box>


      </Container>
    </Box>


  );
};

export default ViewUnit;