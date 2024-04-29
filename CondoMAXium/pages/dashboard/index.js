import * as React from "react";
import { useRouter } from "next/router";
import { useState, useEffect } from 'react';

import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AddIcon from "@mui/icons-material/Add";
import PropertyIcon from "@mui/icons-material/Category";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Added profile icon
import supabase from "../../config/supabaseClient";


function Copyright(props) {
  
  return (
      <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          {...props}
      >
        {"Copyright © "}
        <Link color="inherit" href="https://mui.com/">
          CondoMAXium
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Dashboard() {
  
  const [notificationCount, setNotificationCount] = useState('');
  const [open, setOpen] = React.useState(true);
  const [showMoreInfo, setShowMoreInfo] = React.useState(false); // Define showMoreInfo state variable
  const router = useRouter();
  const [units, setUnits] = React.useState([]);
  const [selectedUnit, setSelectedUnit] = React.useState(null); // State to store selected unit

// Handler function to handle clicks on property items
  const handleClick = (unit) => {
    setSelectedUnit(unit); // Update selected unit
  };

  // Function to toggle showing more info
  const toggleMoreInfo = () => {
    setShowMoreInfo(!showMoreInfo);
  };


  const toggleDrawer = () => {
    setOpen(!open);
  };

  React.useEffect(() => {
    const fetchUnits = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const { data: RequestData, error:RequestError } = await supabase
        .from('requests')
        .select('status')
        .eq('user', user.email)
        .eq('status', 'Open');

        if (error) {
          console.log('Error: ', RequestError);
        } else {
          console.log('Returned data: ', RequestData);
          console.log(`The email ${user.email} exists in ${RequestData.length} row(s) with status 'Open'.`);
          setNotificationCount(RequestData.length);
        }
        

        // Extract user email
        const userEmail = user?.email;
        if (!userEmail) {
          throw new Error("User email not found");
        }

        // Fetch units associated with the user's email
        const { data, error } = await supabase
            .from("units")
            .select("*")
            .eq("emailUnit", userEmail); // Adjust the column name as per your database schema
        if (error) {
          throw error;
        }

        setUnits(data);
        if (data.length > 0) {
          setSelectedUnit(data[0]); // Initialize selectedUnit with the first unit
        }
      } catch (error) {
        console.error("Error fetching units:", error.message);
      }
    };

    fetchUnits();
  }, []);


  // Handler function to navigate to the profile page
  const goToProfile = () => {
    router.push("/profile");
  };

  return (
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="absolute" open={open}>
            <Toolbar
                sx={{
                  pr: "24px", // keep right padding when drawer closed
                }}
            >
              <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={toggleDrawer}
                  sx={{
                    marginRight: "36px",
                    ...(open && { display: "none" }),
                  }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                  component="h1"
                  variant="h6"
                  color="inherit"
                  noWrap
                  sx={{ flexGrow: 1 }}
              >
                Dashboard
              </Typography>
              <IconButton color="inherit">
                <Badge badgeContent={notificationCount} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              {/* Profile Button */}
              <IconButton color="inherit" onClick={goToProfile}>
                <AccountCircleIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <Toolbar
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  px: [1],
                }}
            >
              <IconButton aria-label="close drawer" onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
              {/* Existing list items */}
              <Divider sx={{ my: 1 }} />
              {units.map((unit) => (
                  <ListItem button key={unit.id} onClick={() => handleClick(unit)}>
                    <ListItemIcon>
                      <PropertyIcon />
                    </ListItemIcon>
                    <ListItemText primary={unit.property_name} />
                  </ListItem>
              ))}
              <Divider sx={{ my: 1 }} />
              {/* Add property button */}
              <ListItem
                  button
                  aria-label="add property"
                  onClick={() => router.push("/add-property")}
              >
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Add Property" />
              </ListItem>
            </List>
          </Drawer>
          <Box
              component="main"
              sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === "light"
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                flexGrow: 1,
                height: "100vh",
                overflow: "auto",
              }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'flex-start',
                    width: '100%',
                  }}
              >
                {/* Unit Picture */}
                {selectedUnit && (
                    <div style={{ flex: { xs: 'none', md: '0 0 30%' }, marginRight: { xs: 0, md: '1rem' }, marginBottom: { xs: '1rem', md: 0 } }}>
                      {selectedUnit.picture && (
                          <img
                              src={selectedUnit.picture}
                              alt="unit"
                              style={{ width: '100%', maxWidth: '200px' }}
                          />
                      )}
                    </div>
                )}
                {/* Unit Details */}
                <div style={{ flex: '1', paddingLeft: '1rem' }}>
                  <Typography variant="h5" gutterBottom>
                    Unit Details
                  </Typography>
                  {selectedUnit && (
                      <>
                        <Typography variant="body1">
                          Property: {selectedUnit.property_name}
                        </Typography>
                        <Typography variant="body1">
                          Unit Number: {selectedUnit.unit_number}
                        </Typography>
                        <Typography
                            variant="body1"
                            color="primary"
                            onClick={toggleMoreInfo}
                            style={{ cursor: 'pointer', textDecoration: 'underline', marginTop: '1rem' }}
                        >
                          See More
                        </Typography>
                        {showMoreInfo && (
                            <>
                              <Typography variant="body1">
                                Unit Owner: {selectedUnit.first_name_owner} {selectedUnit.last_name_owner}
                              </Typography>
                              <Typography variant="body1">
                                Occupied by: {selectedUnit.occupied_by}
                                {selectedUnit.occupied_by === "Tenant" && <br />}
                                {selectedUnit.occupied_by === "Tenant" &&
                                    `Tenant Name: ${selectedUnit.first_name_tenant} ${selectedUnit.last_name_tenant}`
                                }
                                {selectedUnit.occupied_by === "Tenant" && <br />}
                                {selectedUnit.occupied_by === "Tenant" &&
                                    `Tenant Email: ${selectedUnit.tenant_email}`
                                }
                                {selectedUnit.occupied_by === "Tenant" && <br />}
                                {selectedUnit.occupied_by === "Tenant" &&
                                    `Tenant Phone: ${selectedUnit.tenant_phone}`
                                }
                              </Typography>
                              <Typography variant="body1">
                                Size: {selectedUnit.size}
                              </Typography>
                              <Typography variant="body1">
                                Condo Fee per sqft: {selectedUnit.condo_fee_sqft}
                              </Typography>
                              <Typography variant="body1">
                                Parking Number: {selectedUnit.parking_number}
                              </Typography>
                            </>
                        )}
                      </>
                  )}
                </div>
              </Paper>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
  );
}
