// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import supabase from "../../config/supabaseClient";
// import {
//     Typography,
//     Container,
//     Box,
//     Avatar,
//     Button,
//     Grid,
// } from "@mui/material";
// import styles from "../../styles/profile.module.css";

// const ProfilePage = () => {
//     const [employee, setEmployee] = useState({
//         first_name: '',
//         last_name: '',
//         email: '',
//         phone: '',
//     });
//     const router = useRouter();

//     useEffect(() => {
//         const fetchEmployeeData = async () => {
//             try {
//                 // Get the current user
//                 const { data: user, error: userError } = await supabase.auth.getUser();
//                 if (userError) throw userError;
                
//                 if (user) {
//                     // Fetch employee data based on the user's email
//                     const { data: employeeData, error: fetchError } = await supabase
//                         .from("employees")
//                         .select("*")
//                         .eq("email", user.email)
//                         .single();
                    
//                     if (fetchError) throw fetchError;

//                     setEmployee({
//                         first_name: employeeData.first_name || '',
//                         last_name: employeeData.last_name || '',
//                         email: employeeData.email || '',
//                         phone: employeeData.phone_number || '',
//                     });
//                 }
//             } catch (error) {
//                 console.error("Error fetching user data:", error.message);
//             }
//         };

//         fetchEmployeeData();
//     }, []);

//     return (
//         <Box className={styles.outerContainer}>
//             <Container className={styles.profileContainer} maxWidth="sm">
//                 <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                         <Box className={styles.profileBox}>
//                             <Avatar
//                                 alt={`${employee.first_name} ${employee.last_name}`}
//                                 src="" // Placeholder for avatar image
//                                 sx={{ width: 95, height: 95, margin: "0 auto" }}
//                             />
//                             <Typography variant="h4" component="h1" className={styles.profileHeader} gutterBottom>
//                                 {`${employee.first_name} ${employee.last_name}`}
//                             </Typography>
//                             <Box className={styles.profileDetails}>
//                                 <Typography variant="h6"><strong>Email: {employee.email}</strong></Typography>
//                                 <Typography variant="h6"><strong>Phone: {employee.phone}</strong></Typography>
//                             </Box>
//                             <Button
//                                 className={styles.button}
//                                 variant="contained"
//                                 color="error"
//                                 onClick={async () => {
//                                     const { error } = await supabase.auth.signOut();
//                                     if (error) {
//                                         console.error("Error signing out:", error.message);
//                                     } else {
//                                         console.log("User signed out successfully");
//                                         router.push("/");
//                                     }
//                                 }}
//                             >
//                                 Logout
//                             </Button>
//                         </Box>
//                     </Grid>
//                 </Grid>
//             </Container>
//         </Box>
//     );
// };

// export default ProfilePage;

import React from "react";
// import { Navigate, useNavigate } from "react-router-dom";
import {
    AuthChangeEvent,
    QueryResult,
    QueryData,
    QueryError,
} from "@supabase/supabase-js";
import supabase from "../../config/supabaseClient";
import { useState, useEffect } from "react";
import Header from "../../components/layout/Header";
import { useRouter } from "next/router";

import {
    Typography,
    Container,
    Box,
    Avatar,
    Button,
    TextField,
    Grid,
} from "@mui/material";
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";
import styles from "../../styles/profile.module.css";

const {
    data: { user },
} = await supabase.auth.getUser();

// Get the user's ID
const userEmail = user?.email;
console.log("This is user email:", userEmail);
// Fetch data from your_table where the user_id matches the current user's ID
const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("emailProfile", userEmail);


if (error) {
    console.error("Error: ", error);
} else {
    console.log("Data: ", data);
}

const ProfilePage = () => {
    const router = useRouter();
    const [employee, setEmployee] = useState({
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
        });
    
        useEffect(() => {
            const fetchEmployeeData = async () => {
                try {
                    // Get the current user
                    const { data: user, error: userError } = await supabase.auth.getUser();
                    if (userError) throw userError;
                    
                    if (user) {
                        // Fetch employee data based on the user's email
                        const { data: employeeData, error: fetchError } = await supabase
                            .from("employees")
                            .select("*")
                            .eq("email", user.email)
                            .single();
                        
                        if (fetchError) throw fetchError;
    
                        setEmployee({
                            first_name: employeeData.first_name || '',
                            last_name: employeeData.last_name || '',
                            email: employeeData.email || '',
                            phone: employeeData.phone_number || '',
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error.message);
                }
            };
    
            fetchEmployeeData();
        }, []);

    return (
        <>
        <Header></Header>
        <Box className={styles.outerContainer}>
            <Container className={styles.profileContainer} maxWidth="sm">
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                <Box className={styles.profileBox}>
                    <Avatar
                        alt={employee.first_name}
                        src=""
                        sx={{ width: 95, height: 95, margin: "0 auto" }}
                    />
                    <Typography
                        variant="h4"
                        component="h1"
                        className={styles.profileHeader}
                        gutterBottom
                    >
                        {employee.first_name}
                    </Typography>
                    <Typography className={styles.profileDetails} gutterBottom>
                        <strong>My Profile</strong>
                    </Typography>
                    <Box className={styles.profileDetails}>
                    <Typography variant="h6">
                        <strong>{employee.email}</strong>
                    </Typography>
                    <Typography variant="h6">
                        <strong>{employee.phone}</strong>
                    </Typography>
                    </Box>
                    <Box className={styles.logoutButtonContainer}>
                    <Button
                        className={styles.button}
                        variant="contained"
                        color="error"
                        onClick={async function signOutUser() {
                        router.push("/");
                        const { error } = await supabase.auth.signOut();
                        if (error) {
                            console.error("Error signing out:", error.message);
                        } else {
                            console.log("User signed out successfully");
                            // Clearing local storage and session storage
                            localStorage.clear();
                            sessionStorage.clear();
                        }
                        console.log(supabase.auth.getUser());
                        }}
                    >
                        Logout
                    </Button>
                    </Box>
                </Box>
                </Grid>
                <Grid item xs={12}>
                <Box className={styles.paymentBox}>
                    <Typography className={styles.paymentTitle} gutterBottom>
                        Features
                    </Typography>
                    <TableContainer>
                    <Table className={styles.paymentTable}>
                        <TableBody>
                        <TableRow>
                            <TableCell>
                            <Button
                                className={styles.button}
                                variant="contained"
                                color="primary"
                                onClick={() => router.push("/units")}
                            >
                                Units
                            </Button>
                            </TableCell>

                            <TableCell>
                            <Button
                                className={styles.button}
                                variant="contained"
                                color="primary"
                                onClick={() => router.push("/dashboard")}
                            >
                                Dashboard
                            </Button>
                            </TableCell>
                            <TableCell>
                            <Button
                                className={styles.button}
                                variant="contained"
                                color="primary"
                                onClick={() => router.push("/reservation")}
                            >
                                Reservations
                            </Button>
                            </TableCell>
                        </TableRow>
                        </TableBody>
                    </Table>
                    </TableContainer>

                    {/* <TableContainer>
                    <Table className="payment-table"></Table>
                    </TableContainer> */}
                </Box>
                </Grid>
            </Grid>
            </Container>
        </Box>
        </>
    );
};

export default ProfilePage;

