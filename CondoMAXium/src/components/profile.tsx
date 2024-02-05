// ProfilePage.tsx

import React from 'react';
import { Typography, Container, Box, Avatar, Button, TextField, Grid } from '@mui/material';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import './profileCss.css';

interface UserProfile {
    phone: string;
    name: string;
    email: string;
    sex: string;
    properties: Property[];
    payments: Payment[];
}

interface Property {
    name: string;
    available: boolean;
}

interface Payment {
    outstandingCharges: number;
}

const user: UserProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    sex: 'Male',
    phone: '438-886-9196', 
    properties: [
        { name: 'Property 1', available: true },
        { name: 'Property 2', available: false },
        { name: 'Property 3', available: true },
        { name: 'Property 4', available: false },
        { name: 'Property 5', available: true },
        { name: 'Property 6', available: false },
        { name: 'Property 7', available: true },
        { name: 'Property 8', available: false },
        { name: 'Property 9', available: false },
    ],
    payments: [
        { outstandingCharges: 100 },
    ],
};

const ProfilePage: React.FC = () => {
    const handleLogout = () => {
        console.log('Logging out...');
    };

    const handlePay = (paymentIndex: number) => {
        console.log(`Processing payment for payment index ${paymentIndex}...`);
    };

    return (

        <Box className="outer-container" >
            <Container className="profile-container" maxWidth="sm">
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Box className="profile-box">
                            <Avatar alt={user.name} src="/path/to/profile-pic.jpg" sx={{ width: 100, height: 100, margin: '0 auto' }} />
                            <Typography variant="h4" component="h1" className="profile-header" gutterBottom>
                                {user.name}
                            </Typography>
                            <Typography className="profile-details" gutterBottom>
                                <strong>My Profile</strong>
                            </Typography>
                            <Box className="profile-details">
                                <Typography variant="h6">
                                    <strong>Sex: {user.sex}</strong>
                                </Typography>
                                <Typography variant="h6">
                                    <strong>{user.email}</strong>
                                </Typography>
                                <Typography variant="h6">
                                    <strong>{user.phone}</strong>
                                </Typography>
                            </Box>
                            <Box className="logout-button-container">
                                <Button variant="contained" color="error" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} className="second-grid">
                        <Box className="properties-box">
                            <Typography className="properties-title" gutterBottom>
                                Properties
                            </Typography>
                            <div className="properties-div">
                                {user.properties.map((property, index) => (
                                    <Typography key={index} variant="body1">
                                        {property.name} - <span style={{ color: property.available ? 'green' : 'red' }}>{property.available ? 'Available' : 'Rented'}</span>
                                    </Typography>
                                ))}
                            </div>
                        </Box>
                        <Box className="key-box">
                            <Typography className="key-title" gutterBottom>
                                Keys
                            </Typography>
                            <TextField label="Enter Keys" fullWidth InputProps={{ style: { height: '50px' } }} />
                        </Box>
                    </Grid>

                    <Grid item xs={12} >
                        <Box className="payment-box">
                            <Typography className="payment-title" gutterBottom>
                                Payments
                            </Typography>
                            <TableContainer>
                                <Table className="payment-table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Outstanding Charges</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {user.payments.map((payment, index) => (
                                            <TableRow key={index}>
                                                <TableCell>${payment.outstandingCharges}</TableCell>
                                                <TableCell>
                                                    <Button variant="contained" color="primary" onClick={() => handlePay(index)}>
                                                        Pay
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

    );
};

export default ProfilePage;
