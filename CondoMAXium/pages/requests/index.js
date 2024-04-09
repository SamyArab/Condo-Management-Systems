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
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AddIcon from "@mui/icons-material/Add";
import Link from "@mui/material/Link";

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

// Custom styled Drawer component
const Drawer = styled(MuiDrawer, {
    shouldForwardProp: prop => prop !== "open"
})(({ theme, open }) => ({
    "& .MuiDrawer-paper": {
        position: "relative",
        whiteSpace: "nowrap",
        width: open ? drawerWidth : 0, // Adjust width based on open state
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        }),
        boxSizing: "border-box",
        overflowX: "hidden", // Hide content overflow when closed
        ...(open && {
            // Ensure drawer remains open on larger screens
            [theme.breakpoints.up("sm")]: {
                width: drawerWidth,
                position: "relative"
            }
        })
    }
}));

function StatusIndicator({ status }) {
    const paddingHorizontal=2;
    const paddingVertical=1;
    const minWidth=100;

    return (
      <Box
        sx={{
          ...statusStyles[status],
          borderRadius: '20px', // Rounded corners
          alignItems:"center",
          justifyContent:"center",
          pX: paddingHorizontal,
          pY:paddingVertical,
          minWidth:minWidth,
          display: 'inline-flex', // Make the box wrap its content
        }}
      >
        <Typography variant="body2" sx={{ color: 'white' }}>
          {status}
        </Typography>
      </Box>
    );
  }

export default function Requests() {
    const [open, setOpen] = React.useState(true);
    
    const toggleDrawer = () => {
      setOpen(!open);
    };

    const rows = [
        {id: 1, Subject:"Row1 Data 1", Type: 'Row 1 Data 2', AssignedTo: 'Row 1 Data 3', status: 'Resolved' },
        { id: 2, Subject:"Row2 Data 1", Type: 'Row 2 Data 2', AssignedTo: 'Row 2 Data 3', status: 'In Progress' },
        { id: 3, Subject:"Row3 Data 1", Type: 'Row 3 Data 2', AssignedTo: 'Row 3 Data 3', status: 'Open' },
        { id: 4, Subject:"Row4 Data 1", Type: 'Row 4 Data 2', AssignedTo: 'Row 4 Data 3', status: 'In Progress' },
        { id: 5, Subject:"Row5 Data 1", Type: 'Row 5 Data 2', AssignedTo: 'Row 5 Data 3', status: 'Resolved' },
        { id: 6, Subject:"Row6 Data 1", Type: 'Row 6 Data 2', AssignedTo: 'Row 6 Data 3', status: 'Resolved' },
        // Add more rows as needed
      ];
  
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
                <MenuIcon/>
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                My Requests
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
            <Grid container spacing={1}>
  <         Grid item xs={12}>
            <Box
                    sx={{
                      p: 2,
                      display: "flex",
                      justifyContent:"space-between",
                      flexDirection: "row",
                    }}
                  >
            <Typography variant="subtitle1">Subject</Typography>
            <Typography variant="subtitle1">Type</Typography>
            <Typography variant="subtitle1">Assigned To</Typography>
            <Typography variant="subtitle1">Status</Typography>
                  </Box>
            </Grid>
            </Grid>
            <Divider />
              <Grid container spacing={2}>
                {/* Chart */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
            {rows.map((row, index) => (
            <React.Fragment key={row.id}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 1 }}>
                <Typography>{row.Subject}</Typography>
                <Typography>{row.Type}</Typography>
                <Typography>{row.AssignedTo}</Typography>
                <StatusIndicator status={row.status} />
              </Box>
              {/* Adding a Divider except after the last row */}
              {index < rows.length - 1 && <Divider />}
            </React.Fragment>
          ))}

                  </Box>
                </Grid>
              </Grid>
              <Copyright sx={{ pt: 4 }} />
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }
  