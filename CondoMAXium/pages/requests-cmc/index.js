import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import supabase from "../../config/supabaseClient";

import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from '@mui/icons-material/Edit';
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const drawerWidth = 240;
const defaultTheme = createTheme();
function Copyright(props) {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: "auto",
                backgroundColor: (theme) =>
                    theme.palette.mode === "light"
                        ? theme.palette.grey[200]
                        : theme.palette.grey[800],
            }}
            {...props}
        >
            <Container maxWidth="lg">
                <Typography variant="body2" align="center">
                    {"Copyright © "}
                    <Link color="inherit" href="https://mui.com/">
                        CondoMAXium
                    </Link>{" "}
                    {new Date().getFullYear()}
                    {"."}
                </Typography>
            </Container>
        </Box>
    );
}

const statusStyles = {
    Resolved: {
        backgroundColor: 'green',
        color: 'white',
    },
    "In Progress": {
        backgroundColor: 'blue',
        color: 'white',
    },
    Open: {
        backgroundColor: 'orange',
        color: 'white',
    },
};

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: prop => prop !== "open"
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    })
}));

const { data: { user } } = await supabase.auth.getUser();
const user_email = user?.email;
console.log(user_email);

const userRequests = () => {
    const [updatedStatus, setUpdatedStatus] = useState('');
    const [updatedAssignedTo, setUpdatedAssignedTo] = useState('');
    const [assignedTo, setAssignedTo] = useState("");
    const [requests, setRequests] = useState([]);
    const [openRequestId, setOpenRequestId] = useState(null);
    const [selectedRequestStatus, setSelectedRequestStatus] = useState("");
    const handleStatusChange = (event) => {
        setSelectedRequestStatus(event.target.value);
    };


    const handleRequestUpdate = async () => {
        try {
            // Update the respective fields in the database for the specific request
            const { data, error } = await supabase
                .from('requests')
                .update({ status: updatedStatus, assigned_to: updatedAssignedTo })
                .eq('id', openRequestId);

            if (error) {
                throw error;
            } 
            router.reload();
        } catch (error) {
            console.error("Error updating request:", error.message);
        }
    };

    useEffect(() => {
        async function fetchRequests() {
            try {
                const { data, error } = await supabase.from('requests').select('*');
                setRequests(data);
                if (error) {
                    throw error;
                }
            } catch (error) {
                console.log("Error fetching requests", error.message);
            }
        }
        fetchRequests();
    }, []);

    const [open, setOpen] = React.useState(true);
    const router = useRouter();
    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: "flex" }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar sx={{ pr: "24px" }}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{ marginRight: "36px", ...(open && { display: "none" }) }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                            My Requests
                        </Typography>
                        <IconButton color="inherit">
                            <Badge badgeContent={4} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Box component="main" sx={{ flexGrow: 1, height: "100vh", overflow: "auto" }}>
                    <Toolbar />
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: "bold" }}>User Email</TableCell>
                                                <TableCell sx={{ fontWeight: "bold" }}>Subject</TableCell>
                                                <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                                                <TableCell sx={{ fontWeight: "bold" }}>Assigned To</TableCell>
                                                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                                                <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {requests.map((request, index) => (
                                                <React.Fragment key={index}>
                                                    <TableRow>
                                                        <TableCell>{request.user}</TableCell>
                                                        <TableCell>{request.subject}</TableCell>
                                                        <TableCell>{request.type}</TableCell>
                                                        <TableCell>{request.assigned_to}</TableCell>
                                                        <TableCell>
                                                            <Box
                                                                sx={{
                                                                    ...statusStyles[request.status],
                                                                    borderRadius: '20px',
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    px: 2,
                                                                    py: 1,
                                                                    minWidth: 100,
                                                                    display: 'inline-flex',
                                                                }}
                                                            >
                                                                <Typography variant="body2" sx={{ color: 'white' }}>
                                                                    {request.status}
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <IconButton onClick={() => setOpenRequestId(openRequestId === request.id ? null : request.id)}>
                                                                <EditIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                    {openRequestId === request.id && (
                                                        <TableRow>
                                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                                <Collapse in={openRequestId === request.id}>
                                                                    <Box sx={{ display: "flex", padding: 1 }}>
                                                                        <Box sx={{ flex: 1 }}>
                                                                            {/* <Typography variant="subtitle2">Description:</Typography> */}
                                                                            <TextField
                                                                                multiline
                                                                                rows={8} // Increase the number of rows for a larger height
                                                                                value={request.description}
                                                                                disabled // Disable editing
                                                                                sx={{ marginTop: 2, width: "100%" }} // Set width to 100%
                                                                            />
                                                                        </Box>
                                                                        <Box sx={{ flex: 1, marginLeft: 2 }}>
                                                                            <Typography variant="subtitle2">Edit Status:</Typography>
                                                                            <Select
                                                                                value={updatedStatus}
                                                                                onChange={(event) => setUpdatedStatus(event.target.value)}
                                                                                sx={{ width: "100%", marginBottom: 1 }} // Adjust the width and spacing as needed
                                                                            >
                                                                                <MenuItem value="Open">Open</MenuItem>
                                                                                <MenuItem value="In Progress">In Progress</MenuItem>
                                                                                <MenuItem value="Resolved">Resolved</MenuItem>
                                                                            </Select>
                                                                            <TextField
                                                                                name="assignedTo"
                                                                                label="Edit Assigned To"
                                                                                value={updatedAssignedTo}
                                                                                onChange={(event) => setUpdatedAssignedTo(event.target.value)}
                                                                                fullWidth
                                                                                margin="normal"
                                                                                sx={{ marginBottom: 1 }} // Adjust the spacing as needed
                                                                            />


                                                                            <Button variant="contained" onClick={handleRequestUpdate} sx={{ marginTop: 1 }}>
                                                                                Update
                                                                            </Button>
                                                                        </Box>
                                                                    </Box>
                                                                </Collapse>


                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </React.Fragment>
                                            ))}

                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </Container>
                    <Copyright />
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default userRequests;
