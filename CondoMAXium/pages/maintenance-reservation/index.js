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
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DateRangeIcon from "@mui/icons-material/DateRange";

import Head from "next/head";

// Sample data for reservations
const reservations = [
  {
    id: 1,
    name: "Maintenance 1",
    description: "Description of reservation 1",
    image: "/property1.jpg",
    capacity: "30",
    hours: "18:00 - 23:00",
    availability: "Yes",
  },
  {
    id: 2,
    name: "Maintenance 2",
    description: "Description of reservation 2",
    image: "/property1.jpg",
    capacity: "10",
    hours: "08:00 - 21:00",
    availability: "Yes",
  },
];

function renderReservation(reservation) {
  return (
    <Grid item xs={12} key={reservation.id}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "row", // Keep row direction
          alignItems: "flex-start", // Align items to the top
          position: "relative", // Added for positioning the button
          borderRadius: "12px",
          width: "100%", // Ensure the paper takes full width
        }}
        data-testid="reservation-card" // Add data-testid attribute here
      >
        <img
          src={reservation.image}
          alt={reservation.name}
          style={{
            width: "25%",
            borderRadius: "15px",
            marginRight: "20px",
          }}
        />
        <div>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ textDecoration: "underline" }}
          >
            {reservation.name}
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              fontStyle: "italic",
              maxWidth: "500px",
              fontSize: "15px",
            }}
          >
            {reservation.description}
          </Typography>
          <br />
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              maxWidth: "500px",
              fontSize: "12px",
            }}
          >
            Capacity: {reservation.capacity} people
            <br />
            Hours: {reservation.hours}
            <br />
            Available: {reservation.availability}
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          sx={{
            height: "50px",
            width: "200px",
            position: "absolute",
            bottom: 25,
            right: 35,
            borderRadius: "22px",
            textDecoration: "underline",
          }}
        >
          Reserve
        </Button>
      </Paper>
    </Grid>
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

export default function MaintenanceReservation() {
  const [open, setOpen] = React.useState(true);
  const [currentDate, setCurrentDate] = React.useState(new Date()); // State for current date
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleDateChange = () => {
    // Logic for changing date
    console.log("Change Date button clicked");
  };

  const router = useRouter();

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
                <CalendarMonthIcon />
              </IconButton>
              <Typography
                fontWeight="bold"
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                Maintenance Reservations
              </Typography>
              <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <NotificationsIcon />
                </Badge>
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
              <ListItem button>
                <ListItemIcon>
                  <DateRangeIcon /> {/* Icon for week 1 */}
                </ListItemIcon>
                <ListItemText primary="Week 1" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <DateRangeIcon /> {/* Icon for week 2 */}
                </ListItemIcon>
                <ListItemText primary="Week 2" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <DateRangeIcon /> {/* Icon for week 3 */}
                </ListItemIcon>
                <ListItemText primary="Week 3" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <DateRangeIcon /> {/* Icon for week 4 */}
                </ListItemIcon>
                <ListItemText primary="Week 4" />
              </ListItem>
              <Divider sx={{ my: 1 }} />
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
            <Container sx={{ mt: 3, mb: 1, textAlign: "center" }}>
              <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
                {currentDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                {/* Display current date */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDateChange}
                  sx={{ ml: 2, borderRadius: "10px" }}
                >
                  Change Day
                </Button>
              </Typography>
            </Container>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={3}>
                {reservations.map((reservation) =>
                  renderReservation(reservation)
                )}
              </Grid>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}
