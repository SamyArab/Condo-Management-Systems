import * as React from "react";
import { useRouter } from "next/router";

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
  const [open, setOpen] = React.useState(true);
  const [properties, setProperties] = React.useState([]);
  const [selectedProperty, setSelectedProperty] = React.useState(null); // State for selected property
  const [showMoreInfo, setShowMoreInfo] = React.useState(false); // Define showMoreInfo state variable
  const router = useRouter();
  const [units, setUnits] = React.useState([]);
  const [selectedUnit, setSelectedUnit] = React.useState(null);

// Define a function to handle selecting a unit
  const handleSelectUnit = (unit) => {
    setSelectedUnit(unit);
  };


  // Function to toggle showing more info
  const toggleMoreInfo = () => {
    setShowMoreInfo(!showMoreInfo);
  };


  const toggleDrawer = () => {
    setOpen(!open);
  };

  React.useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Get the user object from Supabase auth
        const user = supabase.auth.user();

        // Extract user email
        const userEmail = user?.emailProfile;
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

        // Select the first unit if there are units available
        if (data.length > 0) {
          setSelectedUnit(data[0]);
        }
      } catch (error) {
        console.error("Error fetching units:", error.message);
      }
    };

    fetchProperties();
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
                <Badge badgeContent={4} color="secondary">
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
              {/* Your existing list items */}
              <Divider sx={{ my: 1 }} />
              {/* New items for properties */}
              {properties.map((property) => (
                  <ListItem button key={property.id} onClick={() => handleClick(property)}>
                    <ListItemIcon>
                      <PropertyIcon /> {/* Icon for property */}
                    </ListItemIcon>
                    <ListItemText primary={units.property_name} />
                  </ListItem>
              ))}
              <Divider sx={{ my: 1 }} />
              {/* Button to add property */}
              <ListItem
                  button
                  aria-label="add property"
                  onClick={() => router.push("/add-property")}
              >
                <ListItemIcon>
                  <AddIcon /> {/* Icon for adding */}
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
              {/*<Grid container spacing={3}>*/}
                {/* Property Details */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      alignItems: 'flex-start',
                      width: "100%",
                    }}
                >
                  {/* Unit Picture */}
                  {selectedUnit && selectedUnit.picture && (
                      <div style={{
                        flex: { xs: 'none', md: '0 0 30%' },
                        marginRight: { xs: 0, md: '1rem' },
                        marginBottom: { xs: '1rem', md: 0 },
                      }}>
                        <img
                            src={selectedUnit.picture}
                            alt="unit"
                            style={{
                              width: "100%",
                              maxWidth: "200px",
                            }}
                        />
                      </div>
                  )}
                  {/* Unit Details */}
                  <div style={{ flex: '1', paddingLeft: '1rem' }}>
                    <Typography variant="h5" gutterBottom>
                      Unit Details
                    </Typography>
                    <Typography variant="body1">
                      Property: {selectedUnit?.property_name}
                    </Typography>
                    <Typography variant="body1">
                      Unit Number: {selectedUnit?.unit_number}
                    </Typography>
                    <Typography
                        variant="body1"
                        color="primary"
                        onClick={toggleMoreInfo}
                        style={{ cursor: 'pointer', textDecoration: 'underline', marginTop: '1rem' }}
                    >
                      See More
                    </Typography>
                    {/* Additional Info */}
                    {showMoreInfo && (
                        <>
                          <Typography variant="body1">
                            Unit Owner: {selectedUnit?.unit_owner}
                          </Typography>
                          <Typography variant="body1">
                            Occupied by: {selectedUnit?.occupied_by}
                          </Typography>
                          <Typography variant="body1">
                            Size: {selectedUnit?.size}
                          </Typography>
                          <Typography variant="body1">
                            Condo Fee per sqft: {selectedUnit?.condo_fee_sqft}
                          </Typography>
                          <Typography variant="body1">
                            Parking Number: {selectedUnit?.parking_number}
                          </Typography>
                        </>
                    )}
                  </div>
                </Paper>

              </Grid>


              {/*/!* Financial Status *!/*/}
              {/*<Grid item xs={12} md={4} lg={3}>*/}
              {/*  <Paper*/}
              {/*      sx={{*/}
              {/*        p: 2,*/}
                {/*        display: "flex",*/}
                {/*        flexDirection: "column",*/}
                {/*      }}*/}
                {/*  >*/}
                {/*    <Typography variant="h5" gutterBottom>*/}
                {/*      Financial Status*/}
                {/*    </Typography>*/}
                {/*    <Typography variant="body1" gutterBottom>*/}
                {/*      Remaining Balance: $84,500*/}
                {/*    </Typography>*/}
                {/*    <Typography variant="body1" gutterBottom>*/}
                {/*      Next Month's Payment: $2,347.22*/}
                {/*    </Typography>*/}
                {/*    <Typography variant="body1" gutterBottom>*/}
                {/*      Will be taken on February 14th, 2023.*/}
                {/*    </Typography>*/}

                {/*    /!* Graph *!/*/}
                {/*    <div style={{ marginTop: "2rem" }}>*/}
                {/*      /!* Your graph component *!/*/}
                {/*      /!* Replace this with your actual graph component *!/*/}
                {/*      <div>*/}
                {/*        <img*/}
                {/*            src="/payment_graph.png"*/}
                {/*            alt="Payment Graph"*/}
                {/*            style={{ width: "100%" }}*/}
                {/*            fill*/}
                {/*        />*/}
                {/*      </div>*/}
                {/*    </div>*/}
                {/*  </Paper>*/}
                {/*</Grid>*/}
                {/*/!* Recent Requests *!/*/}
                {/*<Grid item xs={12}>*/}
                {/*  <Paper*/}
                {/*      sx={{*/}
                {/*        p: 2,*/}
                {/*        display: "flex",*/}
                {/*        flexDirection: "column",*/}
                {/*      }}*/}
                {/*  >*/}
                {/*    /!* Request Status *!/*/}
                {/*    <Typography variant="h5" gutterBottom>*/}
                {/*      Request Status*/}
                {/*    </Typography>*/}
                {/*    <ul>*/}
                {/*      <li>Request 1</li>*/}
                {/*      <li>Request 2</li>*/}
                {/*      <li>Request 3</li>*/}
                {/*      /!* Add more requests as needed *!/*/}
                {/*    </ul>*/}
                {/*  </Paper>*/}
                {/*</Grid>*/}
              {/*</Grid>*/}
              <Copyright sx={{ pt: 4 }} />
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
  );
}
