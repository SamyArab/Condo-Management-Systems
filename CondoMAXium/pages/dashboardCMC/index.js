import * as React from "react";
import { useRouter } from "next/router";

import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HomeIcon from "@mui/icons-material/Home";
import Button from "@mui/material/Button";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import supabase from "../../config/supabaseClient";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";

import Head from "next/head";


// Define width of drawer
const drawerWidth = 240;

// Custom styled AppBar component
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

// Custom styled Drawer component
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: open ? drawerWidth : 0, // Adjust width based on open state
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    overflowX: "hidden", // Hide content overflow when closed
    ...(open && {
      // Ensure drawer remains open on larger screens
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        position: "relative",
      },
    }),
  },
}));

// PropertyList component
export default function PropertyList() {
  
    const [open, setOpen] = React.useState(true);
    const [properties, setProperties] = React.useState([]); // State to store fetched properties

  // Fetch properties from the database on component mount
  React.useEffect(() => {
    const fetchProperties = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // Get the user's ID
        const userId = user?.id;
        if (!userId) {
          throw new Error("User ID not found");
        }

        // Fetch properties associated with the user's ID
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("profileFky", userId);
        if (error) {
          throw error;
        }

        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error.message);
      }
    };
    const goToNotificationCMC = () => {
        router.push("/notifications-cmc");
    };

    fetchProperties();
  }, []);

  const goToProfile = () => {
    router.push("/profile");
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));


  const toggleDrawer = () => {
    setOpen(!open);
  };

  const router = useRouter();

  // Function to render a single property
  const renderProperty = (property) => {
    // Handle click event for adding amenities
    const handleAmenitiesClick = (propertyid) => {
      // Navigate to add amenities page
      console.log(`Navigating to add amenities for`, propertyid);
      // router.push({
      //   pathname: "/add-amenity",
      //   // query: { propertyid: propertyid },
      // });

    };
    // Handle click event for maintenance
    const handleMaintenanceClick = (propertyId) => {
      // Navigate to maintenance page
      console.log(`Navigating to maintenance for`, propertyId);
      // router.push({
      //   pathname: "/requests-cmc",
      //   // query: { propertyid: propertyid },
      // });
    };
    const handlePropertyClick = (propertyid) => {
      console.log("viewing property with index :", propertyid);
      router.push({
        pathname: "/view-property",
        query: { propertyid: propertyid },
      });
    };

    return (
      <>
        <Head>
          <script
            id="sc-script"
            src="https://cdn.smartcat-proxy.com/60a29c2d1d4341e38fbb9d3f4a3bef3d/script-v1/__translator.js?hash=7e6e37c59d0bf7e0a6f687b25f488757"
          />
        </Head>
        <Grid item xs={12} key={property.id}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: isSmallScreen ? "column" : "row", // Adjust direction based on screen size
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <img
              src="/seasidecondos.jpg"
              onClick={() => handlePropertyClick(property.propertyId)}
              alt={property.buildingName}
              style={{
                width: isSmallScreen ? "100%" : "25%", // Adjust image width based on screen size
                borderRadius: "15px",
                marginBottom: isSmallScreen ? "10px" : "0", // Add margin to separate image from text/buttons on small screens
                marginRight: isSmallScreen ? "0" : "20px", // Add margin between image and text on larger screens
              }}
            />
            <div style={{ width: isSmallScreen ? "100%" : "65%" }}>
              {" "}
              {/* Adjust width based on screen size */}
              <Typography
                variant="h5"
                gutterBottom
                sx={{ textDecoration: "underline", marginBottom: "8px" }}
                onClick={() => handlePropertyClick(property.propertyId)}
              >
                {property.buildingName}
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  maxWidth: "500px",
                  fontSize: "12px",
                  marginBottom: "8px",
                }}
              >
                Capacity: {property.unitsCount} units
                <br />
                Parking Spots: {property.parkingCount}
                <br />
                Amenities:
                <br />
                Year Built: {property.yearBuilt}
                <br />
                Lockers/Storage: {property.lockerCount}
                <br />
                Address: {property.street}, {property.province},{" "}
                {property.postalCode}
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                aria-label="Add Amenities"
                // onClick={handleAmenitiesClick(property.propertyId)}
                onClick={() => router.push("/add-amenity")}
                sx={{ minWidth: 120, marginBottom: "8px", width: "100%" }}
                name="Add Amenities" // Set the name attribute
                >
                Add Amenities
              </Button>
              <div style={{ marginBottom: "8px" }} />{" "}
              {/* Add small margin between buttons */}
              <Button
                variant="contained"
                color="secondary"
                // onClick={handleMaintenanceClick(property.propertyId)}
                onClick={() => router.push("/requests-cmc")}
                sx={{ minWidth: 120, marginBottom: "8px", width: "100%" }}
                name="Maintenance" // Set the name attribute
              >
                Maintenance
              </Button>
              <Button
                variant="contained"
                color="secondary"
                // onClick={handleMaintenanceClick(property.propertyId)}
                onClick={() => router.push("/units")}
                sx={{ minWidth: 120, width: "100%" }}
                name="Units" // Set the name attribute
              >
                Units
              </Button>
            </div>
          </Paper>
        </Grid>
      </>
    );
  };

  return (
    <>
      <Head>
        <script
          id="sc-script"
          src="https://cdn.smartcat-proxy.com/60a29c2d1d4341e38fbb9d3f4a3bef3d/script-v1/__translator.js?hash=7e6e37c59d0bf7e0a6f687b25f488757"
        />
      </Head>
      <ThemeProvider theme={createTheme()}>
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
                <HomeIcon /> {/* Home icon */}
              </IconButton>
              <Typography
                fontWeight="bold"
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                Dashboard CMC
              </Typography>
              <Typography
                component="h2"
                variant="h6"
                color="inherit"
                noWrap
                onClick={() => router.push("/manage-employees")}
                // sx={{ flexGrow: 1 }}
              >
                Employees
              </Typography>
              <IconButton color="inherit">
                <Badge aria-label="notification" color="secondary">
                  <NotificationsIcon  onClick={() => router.push("/notifications-cmc")}/>
                </Badge>
              </IconButton>
              <IconButton aria-label="profile" color="inherit" onClick={goToProfile}>
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
              {/* <Divider sx={{ my: 1 }} />
              {units.map((unit) => (
                <ListItem
                  button
                  key={unit.id}
                  onClick={() => handleClick(unit)}
                >
                  <ListItemIcon>
                    <PropertyIcon />
                  </ListItemIcon>
                  <ListItemText primary={unit.property_name} />
                </ListItem>
              ))}
              <Divider sx={{ my: 1 }} /> */}

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
              position: "relative", // Added for positioning the button
            }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={3}>
                {properties.map((property) => renderProperty(property))}
              </Grid>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}
