import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useRouter } from 'next/router';
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
import supabase from "../../config/supabaseClient";


const {
  data: { user },
} = await supabase.auth.getUser();

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

// eslint-disable-next-line react/display-name
const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <button className="date-picker-button" onClick={onClick} ref={ref}>
    {value} <FaCalendarAlt />
  </button>
));
// FormRooftopDeck.displayName = "FormRooftopDeck";


// Adjusted generateTimeOptions to accept start and end parameters
const generateTimeOptions = (availableStartTime, availableEndTime) => {
  const options = [];
  let startHour, startMinute, endHour, endMinute;
  if (availableStartTime && availableEndTime) {
    [startHour, startMinute] = availableStartTime.split(':').map(Number);
    [endHour, endMinute] = availableEndTime.split(':').map(Number);
  } else {
    // Default to full day if not specified
    startHour = 0; startMinute = 0;
    endHour = 23; endMinute = 30;
  }

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = hour === startHour ? startMinute : 0; minute < 60; minute += 30) {
      if (hour === endHour && minute > endMinute) break;
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push(time);
    }
  }
  return options;
};

const defaultTheme = createTheme();

const FormRooftopDeck = () => {
    const [guests, setGuests] = useState(0); 
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Handling date change
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // Date checks
    const isDateInPast = isBefore(selectedDate, startOfDay(new Date()));
    const isDateMoreThanTwoMonthsAhead = isBefore(
        addMonths(startOfDay(new Date()), 2),
        selectedDate
    );

    // Function to generate dropdown options for times
    const generateTimeOptions = (start, end, increment, limitHours = null) => {
        const options = [];
        let startTime = new Date(`2022-01-01T${start}:00`);
        let endTime = new Date(`2022-01-01T${end}:00`);

        // If there's a limitHours, adjust endTime accordingly
        if (limitHours !== null) {
            const limitEndTime = new Date(startTime.getTime() + limitHours * 3600000);
            if (limitEndTime < endTime) {
                endTime = limitEndTime;
            }
        }

        while (startTime <= endTime) {
            const timeString = startTime.toTimeString().substring(0, 5);
            options.push(timeString);
            startTime = new Date(startTime.getTime() + increment * 60000);
        }

        return options;
    };

    // Time options for start time
    const startTimeOptions = generateTimeOptions('18:00', '23:00', 30);

    // Calculate end time options based on selected start time
    let endTimeOptions = startTime ? generateTimeOptions(startTime, '23:00', 30, 2) : [];

    const router = useRouter();
    const { facilityId, facilityTitle, maxGuests, availableStartTime, availableEndTime } = router.query;

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({ guests, startTime, endTime });
        // Integrate with backend here for capacity checks and reservation submission
        const { error } = await supabase
        .from('reservations')
        .insert({ startTime: startTime, endTime: endTime, profileFky: user.id, numOfGuests: guests});
    };

    const formattedDate = format(selectedDate, "PPPP");

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box>
                <AppBar position="absolute">
                    <Toolbar sx={{ justifyContent: "space-between", pr: "24px" }}>
                        <Typography component="h1" variant="h6" color="inherit" noWrap>
                        Reserve RooftopDeck
                        </Typography>
                        <Box   Box sx={{ display: "flex", alignItems: "center" }}>
                        </Box>
                    </Toolbar>
                </AppBar>
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
                        <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <h2 
                                className="formattedDate"
                                style = {{fontFamily: '"RM Neue", sans-serif'}}
                            >
                                {formattedDate}
                            </h2>
                            <DatePicker
                                selected={selectedDate}
                                onChange={handleDateChange}
                                customInput={<CustomInput value={formattedDate} />}
                                withPortal
                        />
                        </Box>
                        <Grid container spacing={3} alignItems="stretch"> {/* Add alignItems="stretch" to make the items of the same height */}
                            {/* Image Grid */}
                            <Grid item xs={12} md={6} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <img
                                    src="rooftop_deck.jpeg"
                                    alt="Private RooftopDeck/Workout Room"
                                    style={{
                                        width: "100%", // Adjust as necessary
                                        height: "auto",
                                        maxWidth: "600px", // Adjust as necessary to control the image size
                                        borderRadius: "4px"
                                    }}
                                />
                            </Grid>
                            {/* Form Grid */}
                            <Grid item xs={12} md={6}>
                                <Paper
                                    sx={{
                                        width: "100%",
                                        maxWidth: "600px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center", // This centers the form vertically
                                        height: "91.5%", // Take full height of parent
                                        p: 2,
                                    }}
                                    style = {{fontFamily: '"RM Neue", sans-serif'}}
                                >
                                    <form onSubmit={handleSubmit} style={{
                                        display: "grid",
                                        gridTemplateRows: "1fr 1fr 1fr 1fr", // Explicitly defines equal size for 4 rows
                                        gap: "20px", // Consistent spacing between elements
                                        alignItems: "center", // Center items vertically for aesthetic spacing
                                        justifyContent: "center",
                                        gridTemplateColumns: "1fr"
                                    }}>
                                        <div>
                                        {/* Directly apply borderBottom styling to labels for visual consistency */}
                                        <label style={{ borderBottom: "1px solid lightgrey", paddingBottom: "10px", display: "block" }}>
                                            Number of Guests:
                                            <input
                                                type="number"
                                                value={guests}
                                                onChange={(e) => setGuests(Math.min(15, Math.max(1, parseInt(e.target.value))))}
                                                min="0"
                                                max="15"
                                                style={{ marginLeft: "10px" }}
                                            />
                                        </label>
                                        </div>
                                        
                                        <div>
                                        <label style={{ borderBottom: "1px solid lightgrey", paddingBottom: "10px", display: "block", borderWidth: "100%"}}>
                                            Start Time:
                                            <select value={startTime} onChange={(e) => setStartTime(e.target.value)} style={{ marginLeft: "10px" }}>
                                            <option value="">Select a start time</option>
                                            {startTimeOptions.map(time => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                            </select>
                                        </label>
                                        </div>
                                        
                                        <div>
                                        <label style={{ borderBottom: "1px solid lightgrey", paddingBottom: "10px", display: "block" }}>
                                            End Time:
                                            <select value={endTime} onChange={(e) => setEndTime(e.target.value)} disabled={!startTime} style={{ marginLeft: "10px" }}>
                                            <option value="">Select an end time</option>
                                            {endTimeOptions.map(time => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                            </select>
                                        </label>
                                        </div>

                                        {/* Ensure the IconButton is styled to not disproportionately expand or contract. Use flex container for center alignment if necessary. */}
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            <IconButton
                                                disabled={isDateInPast || isDateMoreThanTwoMonthsAhead}
                                                sx={{
                                                    alignItems: "center",
                                                    appearance: "button",
                                                    backgroundColor: "#0276FF", 
                                                    borderRadius: "8px", 
                                                    borderStyle: "none",
                                                    boxShadow: "rgba(255, 255, 255, 0.26) 0 1px 2px inset",
                                                    boxSizing: "border-box",
                                                    color: "#fff", 
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    flexShrink: 0,
                                                    fontFamily: "'RM Neue', sans-serif",
                                                    fontSize: "100%", 
                                                    lineHeight: 1.15,
                                                    margin: 0,
                                                    padding: "10px 21px", 
                                                    textAlign: "center",
                                                    textTransform: "none",
                                                    transition: "color .13s ease-in-out, background .13s ease-in-out, opacity .13s ease-in-out, box-shadow .13s ease-in-out",
                                                    userSelect: "none",
                                                    touchAction: "manipulation",
                                                    '&:hover': !isDateInPast && !isDateMoreThanTwoMonthsAhead ?{
                                                        backgroundColor: "#0356e8", 
                                                    } : {},
                                                    '&.Mui-disabled': {
                                                        backgroundColor: "#AAAAAA", 
                                                        color: "#fff", 
                                                    },
                                                }}
                                                type="submit"
                                            >
                                                {!isDateInPast && !isDateMoreThanTwoMonthsAhead ? "Reserve" : "Unavailable"}
                                            </IconButton>
                                        </div>
                                    </form>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

            </Box>
        </ThemeProvider>
    );
};

export default FormRooftopDeck;