import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import supabase from "../../config/supabaseClient";
import Link from "next/link";

import Head from "next/head";

import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import TextField from "@mui/material/TextField";
import Collapse from "@mui/material/Collapse";
import EditIcon from "@mui/icons-material/Edit";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AddIcon from "@mui/icons-material/Add";

const drawerWidth = 240;
const defaultTheme = createTheme();

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

const statusStyles = {
  Resolved: {
    backgroundColor: "green",
    color: "white",
  },
  "In Progress": {
    backgroundColor: "blue",
    color: "white",
  },
  Open: {
    backgroundColor: "orange",
    color: "white",
  },
};

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

const UserRequests = () => {
  const [requests, setRequests] = useState([]);
  const [openRequestId, setOpenRequestId] = useState(null);
  const [formStatus, setFormStatus] = useState({});
  const [formAssignedTo, setFormAssignedTo] = useState({});
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function StatusIndicator({ status }) {
    const paddingHorizontal = 2;
    const paddingVertical = 1;
    const minWidth = 100;

    // function StatusIndicator({ status }) {
    //     const paddingHorizontal = 2;
    //     const paddingVertical = 1;
    //     const minWidth = 100;

    //     return (
    //         <Box
    //             sx={{
    //                 ...statusStyles[status],
    //                 borderRadius: '20px', // Rounded corners
    //                 alignItems: "center",
    //                 justifyContent: "center",
    //                 pX: paddingHorizontal,
    //                 pY: paddingVertical,
    //                 minWidth: minWidth,
    //                 display: 'inline-flex', // Make the box wrap its content
    //             }}
    //         >
    //             <Typography variant="body2" sx={{ color: 'white' }}>
    //                 {status}
    //             </Typography>
    //         </Box>
    //     );
    // }

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleStatusChange = (event, requestId) => {
    setFormStatus({ ...formStatus, [requestId]: event.target.value });
  };

  const handleAssignedToChange = (event, requestId) => {
    setFormAssignedTo({ ...formAssignedTo, [requestId]: event.target.value });
  };

  const handleRequestUpdate = async (requestId) => {
    try {
      await supabase
        .from("requests")
        .update({
          status: formStatus[requestId],
          assigned_to: formAssignedTo[requestId],
        })
        .eq("id", requestId);

      router.reload();
    } catch (error) {
      console.error("Error updating request:", error.message);
    }
  };

  useEffect(() => {
    async function fetchRequests() {
      try {
        const { data, error } = await supabase.from("requests").select("*");
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

  return (
    <>
      <Head>
        <script
          id="sc-script"
          src="https://cdn.smartcat-proxy.com/60a29c2d1d4341e38fbb9d3f4a3bef3d/script-v1/__translator.js?hash=7e6e37c59d0bf7e0a6f687b25f488757"
        />
      </Head>
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
                All Requests
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
              <ListItem
                button
                aria-label="add request"
                onClick={() => router.push("/add-request")}
              >
                <ListItemIcon>
                  <AddIcon /> {/* Icon for adding */}
                </ListItemIcon>
                <ListItemText primary="Add Request" />
              </ListItem>
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{ flexGrow: 1, height: "100vh", overflow: "auto" }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            User Email
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Subject
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Type
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Assigned To
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Status
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Action
                          </TableCell>
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
                                    borderRadius: "20px",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    px: 2,
                                    py: 1,
                                    minWidth: 100,
                                    display: "inline-flex",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "white" }}
                                  >
                                    {request.status}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  onClick={() =>
                                    setOpenRequestId(
                                      openRequestId === request.id
                                        ? null
                                        : request.id
                                    )
                                  }
                                >
                                  <EditIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                            {openRequestId === request.id && (
                              <TableRow>
                                <TableCell
                                  style={{ paddingBottom: 0, paddingTop: 0 }}
                                  colSpan={6}
                                >
                                  <Collapse in={openRequestId === request.id}>
                                    <Box sx={{ display: "flex", padding: 1 }}>
                                      <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle2">
                                          Description:
                                        </Typography>
                                        <TextField
                                          multiline
                                          rows={8}
                                          value={request.description}
                                          InputProps={{
                                            readOnly: true,
                                            style: {
                                              color: "rgba(0, 0, 0, 0.87)",
                                              cursor: "default",
                                              userSelect: "none",
                                              pointerEvents: "none",
                                              borderColor: "transparent",
                                            },
                                          }}
                                          sx={{ marginTop: 0, width: "100%" }}
                                        />
                                      </Box>
                                      <Box sx={{ flex: 1, marginLeft: 2 }}>
                                        <Typography variant="subtitle2">
                                          Edit Status:
                                        </Typography>
                                        <Select
                                          value={
                                            formStatus[request.id] ||
                                            request.status
                                          }
                                          onChange={(event) =>
                                            handleStatusChange(
                                              event,
                                              request.id
                                            )
                                          }
                                          sx={{
                                            width: "100%",
                                            marginBottom: 1,
                                          }}
                                        >
                                          <MenuItem value="Open">Open</MenuItem>
                                          <MenuItem value="In Progress">
                                            In Progress
                                          </MenuItem>
                                          <MenuItem value="Resolved">
                                            Resolved
                                          </MenuItem>
                                        </Select>
                                        <TextField
                                          name="assignedTo"
                                          label="Edit Assigned To"
                                          value={
                                            formAssignedTo[request.id] ||
                                            request.assigned_to
                                          }
                                          onChange={(event) =>
                                            handleAssignedToChange(
                                              event,
                                              request.id
                                            )
                                          }
                                          fullWidth
                                          margin="normal"
                                          sx={{ marginBottom: 1 }}
                                        />
                                        <Button
                                          variant="contained"
                                          onClick={() =>
                                            handleRequestUpdate(request.id)
                                          }
                                          sx={{ marginTop: 1 }}
                                        >
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
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default UserRequests;
