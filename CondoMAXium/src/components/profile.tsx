import React from 'react';
import { Typography, Container, Box, Avatar, Button, TextField, Grid } from '@mui/material';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import './profileCss.css';

interface UserProfile {
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
    properties: [
        { name: 'Property 1', available: true },
        { name: 'Property 2', available: false },
        { name: 'Property 3', available: true },
        { name: 'Property 4', available: false },
        { name: 'Property 5', available: true },
        { name: 'Property 6', available: false },
        { name: 'Property 7', available: false },
        { name: 'Property 8', available: false },
        { name: 'Property 9', available: false },
    ],
    payments: [
        { outstandingCharges: 100},
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
        <Box className="outer-container" bgcolor="#336699" mt={-4} mb={-4}>
            <Container className="profile-container" maxWidth="sm">
                <Grid container spacing={2}>

                    <Grid item xs={12} sm={6}>
                        {/* First Container - User Profile */}
                        <Box bgcolor="#f4f4f4" p={2} borderRadius={8} boxShadow={2}>
                            <Typography variant="h4" component="h1" color="secondary" align="center" gutterBottom>
                                User Profile
                            </Typography>
                            <Avatar alt={user.name} src="/path/to/profile-pic.jpg" sx={{ width: 100, height: 100, margin: '0 auto' }} />
                            <Typography variant="h4" component="h1" className="profile-header" gutterBottom style={{ textAlign: 'center' }}>
                                {user.name}
                            </Typography>
                            <Box className="profile-details">
                                <Typography variant="h6">
                                    <strong>Sex:</strong> {user.sex}
                                </Typography>
                                <Typography variant="h6">
                                    <strong>Email:</strong> {user.email}
                                </Typography>
                                <Typography variant="h6">
                                    <strong>Phone:</strong> {'123-456-7890'}
                                </Typography>
                            </Box>
                            <Box mt={3}>
                                <Button variant="contained" color="error" style={{ display: 'block', margin: '0 auto' }} onClick={handleLogout}>
                                    Logout
                                </Button>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        {/* Third Container - Properties */}
                        <Box bgcolor="#f4f4f4" p={2} borderRadius={8} boxShadow={2}>
                            <Typography variant="h4" component="h1" color="secondary" align="center" gutterBottom>
                                Properties
                            </Typography>

                            {user.properties.map((property, index) => (
                                <Typography key={index} variant="body1">
                                    {property.name} - <span style={{ color: property.available ? 'green' : 'red' }}>{property.available ? 'Available' : 'Rented'}</span>
                                </Typography>
                            ))}
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        {/* Second Container - Text Box for Keys */}
                        <Box bgcolor="#f4f4f4" p={2} borderRadius={8} boxShadow={2}>
                            <Typography variant="h4" component="h1" color="secondary" align="center" gutterBottom>
                                Keys
                            </Typography>
                            <TextField label="Enter Keys" fullWidth />
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        {/* Fourth Container - Payments */}
                        <Box bgcolor="#f4f4f4" p={2} borderRadius={8} boxShadow={2}>
                            <Typography variant="h4" component="h1" color="secondary" align="center" gutterBottom>
                                Payments
                            </Typography>
                            <TableContainer>
                                <Table>
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
