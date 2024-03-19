import React, { useState, useEffect, useRef, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isBefore, startOfDay, addMonths } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { CSSTransition } from "react-transition-group";
import { AccountCircle } from "@mui/icons-material";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import GymRoom from "../../public/gymroom.jpg";
import RoofTopDeck from "../../public/rooftop_deck.jpeg";
import SpaRoom from "../../public/sparoom.jpg";

import { useRouter } from "next/router";
import "../../styles/reservation.module.css";

const drawerWidth = 240;

/**
 * Stylized App Bar at the top of all of the reservation pages
 */
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

/**
 * List of facilities and their data fields
 */
const facilities = [
  {
    id: 1,
    title: "Rooftop Deck",
    description: "Beautiful rooftop deck with decorated lights...",
    capacity: 30,
    hours: "18:00 - 23:00",
    imgLink: "/RoofTop_Deck.jpeg",
    availableStartTime: "18:00",
    availableEndTime: "23:00",
    maxGuests: 15,
    buttonRoute: '/form-rooftop-deck',
  },
  {
    id: 2,
    title: "Private Gym/Workout Room",
    description: "You can work out here",
    capacity: 10,
    hours: "08:00 - 21:00",
    imgLink: "GymRoom.jpg",
    availableStartTime: "08:00",
    availableEndTime: "21:00",
    maxGuests: 2,
    buttonRoute: '/form-gym',
  },
  {
    id: 3,
    title: "Private Spa Session/Sparoom",
    description: "Sauna and stuff",
    capacity: 4,
    hours: "08:00 - 21:00",
    imgLink: "SpaRoom.jpg",
    availableStartTime: "08:00",
    availableEndTime: "21:00",
    maxGuests: 1,
    buttonRoute: '/form-spa',
  },
];


const defaultTheme = createTheme();

const ReservationPage = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);
  const notificationButtonRef = useRef(null);
  const router = useRouter();

  /**
   * Method for handling the click of the Reserve button
   */
  const handleReserveClick = (facility) => {
    console.log(
      `Reserve facility with ID: ${facility} on `
    );
    router.push({
      pathname: facility.buttonRoute,
      query: {
        facilityId: facility.id,
        facilityTitle: facility.title,
        maxGuests: facility.maxGuests,
        availableStartTime: facility.availableStartTime,
        availableEndTime: facility.availableEndTime,
      },
    });
  };

  /**
   * Method for handling the click of the View Reservations button
   */
  const handleViewReservationsClick = () => {
    // navigate("/my-reservations");
    router.push("/my-reservations");
  };

  /**
   * Method for handling the click of the Profile button
   */
  const handleProfileClick = () => {
    // navigate("/profile");
    router.push("/profile");
  };

  /**
   * Method for handling the click of the Notifications button
   */
  const toggleNotifications = (event) => {
    event.stopPropagation(); // Prevents click event from propagating to the document
    setShowNotifications(!showNotifications);
  };


  /**
   * Method for handling clicking outside of notifications box to close it
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target) &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    // Attach the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up the event listener from the document when the component unmounts
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute">
          <Toolbar sx={{ justifyContent: "space-between", pr: "24px" }}>
            <Typography component="h1" variant="h6" color="inherit" noWrap>
              Common Facilities / Reservations
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                size="small"
                color="inherit"
                sx={{ mr: 2 }}
                onClick={handleViewReservationsClick}
              >
                {/* Adjusted margin for spacing */}
                <Typography variant="body2" sx={{ fontSize: "1rem" }}>
                  My Reservations
                </Typography>
              </IconButton>
              <IconButton
                color="inherit"
                onClick={toggleNotifications}
                ref={notificationButtonRef}
              >
                <Badge badgeContent={4} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <CSSTransition
                in={showNotifications}
                timeout={300}
                classNames="dropdown"
                unmountOnExit
                onEnter={() => setShowNotifications(true)}
                onExited={() => setShowNotifications(false)}
              >
                <Box
                  ref={notificationsRef}
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: "100%",
                    backgroundColor: "white",
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                    zIndex: 10,
                    p: 2,
                    mt: 0.5,
                    borderRadius: "4px",
                    minWidth: "200px",
                  }}
                >
                  <Typography color="secondary">
                    No new notifications
                  </Typography>
                </Box>
              </CSSTransition>
              <IconButton onClick={handleProfileClick}>
                <Badge
                  color="secondary"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                >
                  <AccountCircle sx={{ fontSize: 40 }} />{" "}
                  {/* Adjust the icon size as needed */}
                </Badge>
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/*<Toolbar/>*/}

        <Divider />
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
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} lg={15}>
                {facilities.map((facility) => (
                  <Paper
                    key={facility.id}
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      mb: 2,
                    }}
                  >
                    <div key={facility.id}>
                      <div
                        style={{
                          backgroundColor: "#f5f5f5", 
                          width: "100%", 
                          padding: "8px", 
                          boxSizing: "border-box", 
                        }}
                      >
                        <h3 style={{ textDecoration: "underline" }}>
                          {facility.title}
                        </h3>
                      </div>
                      <img
                        src={facility.imgLink}
                        alt={facility.title}
                        style={{
                          width: "100%",
                          height: "auto",
                        }}
                      />
                      <p>{facility.description}</p>
                      <p>Capacity: {facility.capacity} people</p>
                      <p>Hours: {facility.hours}</p>
                      <button
                        className="button-22"
                        onClick={() => handleReserveClick(facility)}
                      >
                          Reserve
                      </button>
                    </div>
                  </Paper>
                ))}
              </Grid>
              {/* Recent Orders */}
              <Grid item xs={12}></Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ReservationPage;
