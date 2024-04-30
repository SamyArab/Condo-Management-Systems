import React, { useState, useEffect, useRef, forwardRef } from "react";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  format,
  isBefore,
  startOfDay,
  addMonths,
  endOfDay,
  formatISO,
} from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import supabase from "../../config/supabaseClient";

/**
 * Supabase connection with user
 */
const {
  data: { user },
} = await supabase.auth.getUser();

/**
 * Stylization of website
 */
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

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <button className="date-picker-button" onClick={onClick} ref={ref}>
    {value} <FaCalendarAlt />
  </button>
));

// Adjusted generateTimeOptions to accept start and end parameters
/**
 * @async
 * @param {*} start
 * @param {*} end
 * @param {*} increment
 * @param {*} [limitHours=null]
 * @returns {unknown}
 */
const generateTimeOptions = async (
  start,
  end,
  increment,
  limitHours = null
) => {
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
    const timeString = `${startTime
      .getHours()
      .toString()
      .padStart(2, "0")}:${startTime.getMinutes().toString().padStart(2, "0")}`;
    const isReserved = await isTimeReserved(timeString);
    if (!isReserved) {
      options.push(timeString);
    }
    startTime.setMinutes(startTime.getMinutes() + increment);
  }

  return options;
};

/**
 * Checks if a specific time slot is reserved on a given date.
 * @async
 * @param {string} time - The time slot to check in "HH:mm" format.
 * @returns {Promise<boolean>} A Promise that resolves to true if the time slot is reserved, false otherwise.
 * @throws {Error} Throws an error if there's an issue with the database query.
 * @example
 * output example :
 * Check if the time slot '10:00' is reserved on the date '2022-03-20'
 * const isReserved = await isTimeReserved('10:00');
 * console.log(isReserved); // Output: true or false
 */

const isTimeReserved = async (time) => {
  const { data, error } = await supabase
    .from("reservations_spa")
    .select("*")
    .eq("date", selectedDate.toISOString().split("T")[0]) // Filter by selected date
    .eq("starttime", time);

  if (error) {
    console.error("Error fetching reservation: ", error);
    return false;
  }

  return data.length > 0; // Returns true if there are reservations_spa for the specified time
};

const defaultTheme = createTheme();

/**
 * ${1:Description placeholder}
 * @date 3/20/2024 - 9:30:40 PM
 *
 * @returns {*}
 */
function FormSpa() {
  const [open, setOpen] = useState(false);
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);
  const [reservedTimes, setReservedTimes] = useState([]);
  const [startTimeOptions, setStartTimeOptions] = useState([]);
  const [guests, setGuests] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
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

  /**
   * Function to get reserved times from supabase
   *
   * @param {Date} selectedDate - The date for which reserved times are to be fetched.
   * @returns {Promise<Array<Object>>} An array of objects containing reserved start and end times.
   *
   * @example
   * const reservedTimes = await fetchReservedTimes(new Date('2024-03-20'));
   * console.log(reservedTimes);
   * // Output: [{ start: 1647772800000, end: 1647776400000 }, { start: 1647780000000, end: 1647783600000 }]
   */
  const fetchReservedTimes = async (selectedDate) => {
    // Ensure selectedDate is a valid Date object
    if (!(selectedDate instanceof Date && !isNaN(selectedDate))) {
      console.error("selectedDate is not a valid date:", selectedDate);
      return [];
    }
    // Format the selected date to ISO string for comparison
    const dateStr = format(selectedDate, "yyyy-MM-dd");

    let { data, error } = await supabase
      .from("reservations_spa")
      .select("starttime, endtime")
      // Assuming 'starttime' and 'endtime' are stored as timestamp with time zone
      .gte("starttime", `${dateStr}T00:00:00+00:00`)
      .lt("endtime", `${dateStr}T23:59:59+00:00`);

    if (error) {
      console.error("Error fetching reserved times:", error);
      return [];
    } else {
      return data.map(({ starttime, endtime }) => ({
        start: new Date(starttime).getTime(),
        end: new Date(endtime).getTime(),
      }));
    }
  };

  useEffect(() => {
    fetchReservedTimes();
  }, [selectedDate]);

  /**
   * Filters available times based on reserved time ranges.
   *
   * @param {Array<string>} allTimes - Array of available time slots.
   * @param {Array<Object>} reservedRanges - Array of reserved time ranges.
   * @returns {Array<string>} Array of available time slots after filtering.
   *
   * @example
   * const allTimes = ['09:00', '09:30', '10:00', '10:30', '11:00'];
   * const reservedRanges = [{ start: 1647772800000, end: 1647776400000 }, { start: 1647780000000, end: 1647783600000 }];
   * const availableTimes = filterAvailableTimes(allTimes, reservedRanges);
   * console.log(availableTimes);
   * // Output: ['09:00', '09:30', '11:00']
   */

  const filterAvailableTimes = (allTimes, reservedRanges) => {
    return allTimes.filter((time) => {
      const timeStart = new Date(
        `${format(selectedDate, "yyyy-MM-dd")}T${time}:00+00:00`
      ).getTime();

      // Check if the time slot starts before any reservation ends and ends after any reservation starts
      return !reservedRanges.some(
        (range) => timeStart >= range.start && timeStart < range.end
      );
    });
  };

  useEffect(() => {
    const updateAvailableTimes = async () => {
      const reservedRanges = await fetchReservedTimes(selectedDate);
      const allTimes = generateTimeOptions("08:00", "23:00", 30);
      const availableTimes = filterAvailableTimes(allTimes, reservedRanges);
      setStartTimeOptions(availableTimes);
    };
    updateAvailableTimes();
  }, [selectedDate]);

  // Calculate end time options based on selected start time
  let endTimeOptions = startTime
    ? generateTimeOptions(startTime, "23:00", 30, 2)
    : [];

  // Router to move between pages
  const router = useRouter();
  const {
    facilityId,
    facilityTitle,
    maxGuests,
    availableStartTime,
    availableEndTime,
  } = router.query;

  /**
   * Handles the submission of reservation form.
   *
   * @param {Event} e - The submit event.
   * @returns {void}
   *
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ guests, startTime, endTime });

    // Format the selected date and times
    const startDate = new Date(selectedDate);
    startDate.setHours(parseInt(startTime.split(":")[0]));
    startDate.setMinutes(parseInt(startTime.split(":")[1]));
    startDate.setSeconds(0); // Ensure seconds are set to 0

    const endDate = new Date(selectedDate);
    endDate.setHours(parseInt(endTime.split(":")[0]));
    endDate.setMinutes(parseInt(endTime.split(":")[1]));
    endDate.setSeconds(0); // Ensure seconds are set to 0

    // Combine date and time into a full timestamp
    const startTimestamp = `${
      startDate.toISOString().split("T")[0]
    } ${startTime}`;
    const endTimestamp = `${endDate.toISOString().split("T")[0]} ${endTime}`;

    // Check if the reservation already exists
    let { data: existingreservations_spa, error } = await supabase
      .from("reservations_spa")
      .select("*")
      .eq("starttime", startTimestamp)
      .eq("endtime", endTimestamp)
      .eq("profileFky", user.id);

    if (error) {
      console.log("Error fetching reservations_spa:", error);
      return;
    }

    // If no existing reservation is found, insert the new one
    if (existingreservations_spa.length === 0) {
      let { error } = await supabase.from("reservations_spa").insert({
        starttime: startTimestamp,
        endtime: endTimestamp,
        profileFky: user.id,
        numOfGuests: guests,
      });

      if (error) {
        console.log("Error inserting reservation:", error);
      } else {
        console.log("Reservation inserted successfully");
      }
    } else {
      console.log("Reservation already exists");
    }
    // Show thank you popup and redirect after a short delay
    setShowThankYouPopup(true);
    setTimeout(() => {
      setShowThankYouPopup(false); // Hide the popup
      router.push("/profile"); // Redirect to the profile page
    }, 3000);
  };

  const formattedDate = format(selectedDate, "PPPP");

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box>
        <AppBar position="absolute">
          <Toolbar sx={{ justifyContent: "space-between", pr: "24px" }}>
            <Typography component="h1" variant="h6" color="inherit" noWrap>
              Reserve Spa
            </Typography>
            <Box Box sx={{ display: "flex", alignItems: "center" }}></Box>
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
                style={{ fontFamily: '"RM Neue", sans-serif' }}
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
            <Grid container spacing={3} alignItems="stretch">
              {" "}
              {/* Add alignItems="stretch" to make the items of the same height */}
              {/* Image Grid */}
              <Grid
                item
                xs={12}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src="sparoom.jpg"
                  alt="Private Spa"
                  style={{
                    width: "100%", // Adjust as necessary
                    height: "auto",
                    maxWidth: "600px", // Adjust as necessary to control the image size
                    borderRadius: "4px",
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
                  style={{ fontFamily: '"RM Neue", sans-serif' }}
                >
                  <form
                    onSubmit={handleSubmit}
                    style={{
                      display: "grid",
                      gridTemplateRows: "1fr 1fr 1fr 1fr", // Explicitly defines equal size for 4 rows
                      gap: "20px", // Consistent spacing between elements
                      alignItems: "center", // Center items vertically for aesthetic spacing
                      justifyContent: "center",
                      gridTemplateColumns: "1fr",
                    }}
                  >
                    <div>
                      {/* Directly apply borderBottom styling to labels for visual consistency */}
                      <label
                        style={{
                          borderBottom: "1px solid lightgrey",
                          paddingBottom: "10px",
                          display: "block",
                        }}
                      >
                        Number of Guests:
                        <input
                          type="number"
                          value={guests}
                          onChange={(e) =>
                            setGuests(
                              Math.min(
                                15,
                                Math.max(1, parseInt(e.target.value))
                              )
                            )
                          }
                          min="0"
                          max="15"
                          style={{ marginLeft: "10px" }}
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          borderBottom: "1px solid lightgrey",
                          paddingBottom: "10px",
                          display: "block",
                          borderWidth: "100%",
                        }}
                      >
                        Start Time:
                        <select
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                        >
                          <option value="">Select a start time</option>
                          {startTimeOptions.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          borderBottom: "1px solid lightgrey",
                          paddingBottom: "10px",
                          display: "block",
                        }}
                      >
                        End Time:
                        <select
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          disabled={!startTime}
                          style={{ marginLeft: "10px" }}
                        >
                          <option value="">Select an end time</option>
                          {endTimeOptions.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
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
                          boxShadow:
                            "rgba(255, 255, 255, 0.26) 0 1px 2px inset",
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
                          transition:
                            "color .13s ease-in-out, background .13s ease-in-out, opacity .13s ease-in-out, box-shadow .13s ease-in-out",
                          userSelect: "none",
                          touchAction: "manipulation",
                          "&:hover":
                            !isDateInPast && !isDateMoreThanTwoMonthsAhead
                              ? {
                                  backgroundColor: "#0356e8",
                                }
                              : {},
                          "&.Mui-disabled": {
                            backgroundColor: "#AAAAAA",
                            color: "#fff",
                          },
                        }}
                        type="submit"
                      >
                        {!isDateInPast && !isDateMoreThanTwoMonthsAhead
                          ? "Reserve"
                          : "Unavailable"}
                      </IconButton>
                    </div>
                  </form>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
        {/* Popup Message */}
        {showThankYouPopup && (
          <Box
            sx={{
              position: "fixed",
              top: "20%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 100,
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
              width: "auto", // Adjust based on your needs
              maxWidth: "80%", // Prevents the popup from being too wide on large screens
            }}
          >
            Thank you for reserving the spa room!
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}

FormSpa.displayName = "FormSpa";

export default FormSpa;
