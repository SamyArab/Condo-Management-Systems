import React, { useState, useEffect, useRef, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, isBefore, startOfDay, addMonths } from 'date-fns';
import { FaCalendarAlt } from 'react-icons/fa';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { CSSTransition } from 'react-transition-group';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import "./reservationCss.css";

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

interface CustomInputProps {
    value?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(
    ({ value, onClick }, ref) => (
        <button className="date-picker-button" onClick={onClick} ref={ref}>
            {value} <FaCalendarAlt />
        </button>
    ),
);

type Facility = {
    id: number;
    title: string;
    description: string;
    capacity: number;
    hours: string;
    imgLink: string;
};

const facilities: Facility[] = [
    {
        id: 1,
        title: 'Rooftop Deck',
        description: 'Beautiful rooftop deck with decorated lights...',
        capacity: 30,
        hours: '18:00 - 23:00',
        imgLink: '/Users/deluca/Desktop/test-react/src/rooftop_deck.jpeg',
    },
    {
        id: 2,
        title: 'Private Gym/Workout Room',
        description: 'You can work out here',
        capacity: 10,
        hours: '08:00 - 21:00',
        imgLink: '/Users/deluca/Desktop/test-react/src/gymroom.jpg',
    },
    {
        id: 3,
        title: 'Private Spa Session/Sparoom',
        description: 'Sauna and stuff',
        capacity: 4,
        hours: '08:00 - 21:00',
        imgLink: '/Users/deluca/Desktop/test-react/src/sparoom.jpg',
    },
];

const defaultTheme = createTheme();

const ReservationPage: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationsRef = useRef<HTMLDivElement | null>(null);
    const notificationButtonRef = useRef<HTMLButtonElement | null>(null);

    const navigate = useNavigate();
    const handleReserveClick = (facilityId: number) => {
        console.log(`Reserve facility with ID: ${facilityId} on ${format(selectedDate, 'PPPP')}`);
        navigate('/form-reservation');
    };

    const handleViewReservationsClick = () => {
        navigate('/my-reservations');
    }

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    const isDateInPast = isBefore(selectedDate, startOfDay(new Date()));
    const isDateMoreThanTwoMonthsAhead = isBefore(addMonths(startOfDay(new Date()), 2), selectedDate);


    const toggleNotifications = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation(); // Prevents click event from propagating to the document
        setShowNotifications(!showNotifications);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node) &&
                notificationButtonRef.current && !notificationButtonRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        // Attach the event listener to the document
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Clean up the event listener from the document when the component unmounts
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const formattedDate = format(selectedDate, 'PPPP');

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute">
                    <Toolbar sx={{ justifyContent: 'space-between', pr: '24px' }}>
                        <Typography component="h1" variant="h6" color="inherit" noWrap>
                            Common Facilities / Reservations
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton size="small" color="inherit" sx={{ mr: 2 }} onClick={handleViewReservationsClick}>
                            {/* Adjusted margin for spacing */}
                                 <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                                     My Reservations
                                 </Typography>
                            </IconButton>
                            <IconButton color="inherit" onClick={toggleNotifications} ref={notificationButtonRef}>
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
                                        position: 'absolute',
                                        right: 0,
                                        top: '100%',
                                        backgroundColor: 'white',
                                        boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
                                        zIndex: 10,
                                        p: 2,
                                        mt: 0.5,
                                        borderRadius: '4px',
                                        minWidth: '200px',
                                    }}
                                >
                                    <Typography color="secondary">No new notifications</Typography>
                                </Box>
                            </CSSTransition>
                            <IconButton>
                                <Badge
                                    color="secondary" // This is the badge color, "secondary" is typically a theme color
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                >
                                    <AccountCircle sx={{ fontSize: 40 }} /> {/* Adjust the icon size as needed */}
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
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <h2 className="formattedDate">{formattedDate}</h2>

                            <DatePicker
                                selected={selectedDate}
                                onChange={handleDateChange}
                                customInput={<CustomInput value={formattedDate}/>}
                                withPortal
                            />
                        </Box>

                        <Grid container spacing={3}>
                            {/* Chart */}
                            {/* Recent Deposits */}
                            <Grid item xs={12} md={4} lg={15}>

                                {/*/!* Financial Status *!/*/}
                                {/*<Typography variant="h5" gutterBottom>*/}
                                    {/*    Financial Status*/}
                                    {/*</Typography>*/}
                                    {/*<Typography variant="body1" gutterBottom>*/}
                                    {/*    Remaining Balance: $84,500*/}
                                    {/*</Typography>*/}
                                    {/*<Typography variant="body1" gutterBottom>*/}
                                    {/*    Next Month's Payment: $2,347.22*/}
                                    {/*</Typography>*/}
                                    {/*<Typography variant="body1" gutterBottom>*/}
                                    {/*    Will be taken on February 14th, 2023.*/}
                                    {/*</Typography>*/}
                                    {facilities.map((facility) => (
                                        <Paper
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                mb: 2
                                            }}
                                        >
                                            <div
                                                key={facility.id}
                                                className={`facility-card ${isDateInPast || isDateMoreThanTwoMonthsAhead ? 'dimmed' : ''}`}
                                            >
                                                <div style={{
                                                    backgroundColor: '#f5f5f5', // Light grey background
                                                    width: '100%', // Take up the full width of its container
                                                    padding: '8px', // Add some padding around the content for better presentation
                                                    boxSizing: 'border-box', // Ensures padding does not add to the total width
                                                }}
                                                >
                                                    <h3 style={{textDecoration: 'underline'}}>{facility.title}</h3>
                                                </div>
                                                <img
                                                    src={facility.imgLink} // Use the imageUrl from your facility object
                                                    alt={facility.title} // Providing an alt text for accessibility
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto'
                                                    }}
                                                />
                                                <p>{facility.description}</p>
                                                <p>Capacity: {facility.capacity} people</p>
                                                <p>Hours: {facility.hours}</p>
                                                {/*{isDateInPast || isDateMoreThanTwoMonthsAhead ? (*/}
                                                {/*    <div*/}
                                                {/*        className="reserved-overlay">{isDateInPast ? 'Reserved' : 'Cannot Book At This Time'}</div>*/}
                                                {/*) : null}*/}
                                                <button
                                                    className="button-22"
                                                    disabled={isDateInPast || isDateMoreThanTwoMonthsAhead}
                                                    onClick={() => handleReserveClick(facility.id)}
                                                >
                                                    {!isDateInPast && !isDateMoreThanTwoMonthsAhead ? 'Reserve' : 'Unavailable'}
                                                </button>
                                            </div>
                                        </Paper>
                                    ))}


                            </Grid>
                            {/* Recent Orders */}
                            <Grid item xs={12}>


                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default ReservationPage;

