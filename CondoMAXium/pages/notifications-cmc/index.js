import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { AppBar, Toolbar, IconButton, Badge, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { Notifications as NotificationsIcon, subject } from '@mui/icons-material';
import supabase from "../../config/supabaseClient";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PropertyIcon from "@mui/icons-material/Category";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import Head from "next/head";

const notificationsData = [
  { id: 1, subject: "An update on your request has been made", from: "CMC", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." },
  { id: 2, subject: "Reservation Confirmation", from: "CMC", description: "Lorem ipsum dolor sit amet, consectetur..." },
  // COULD DO {SUBJECT, TYPE, STATUS, DESCRIPTION} FOR REQUESTS IF NOTIFICATIONS IS MOSTLY USED FOR REQUESTS 
  // REPLACE WITH ACTUAL BACKEND
];

const NotificationsCMCPage = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notificationsData, setNotificationsData] = useState([]);
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserData(user);
    }
    catch (error) {
      console.error("Error fetching user: ", error.message);
    }
    try {
      let { data: notifications, error } = await supabase
        .from('requests')
        .select('*');
      setNotificationsData(notifications);
    }
    catch (error) {
      console.error("Error fetching notifications: ", error.message);
    }
  };

  const handleNotificationSelect = (notification) => {
    setSelectedNotification(notification);
  };
  const goToProfile = () => {
    router.push("/profile");
  };
  const goToDashboard = () => {
    router.push("/dashboardCMC");
  };

  return (
    <div>
      <Head>
        <script
          id="sc-script"
          src="https://cdn.smartcat-proxy.com/60a29c2d1d4341e38fbb9d3f4a3bef3d/script-v1/__translator.js?hash=7e6e37c59d0bf7e0a6f687b25f488757"
        />
      </Head>
      <AppBar position="absolute">
            <Toolbar sx={{ pr: "24px" }}>
              {/* <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                // onClick={toggleDrawer}
                sx={{
                  marginRight: "36px",
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton> */}
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                CondoMAXium
              </Typography>
              <Typography
                component="h2"
                variant="h6"
                color="inherit"
                noWrap
                onClick={() => router.push("/dashboardCMC")}
                // sx={{ flexGrow: 1 }}
              >
                Dashboard
              </Typography>
              <IconButton color="inherit">
                <Badge color="secondary">
                  <NotificationsIcon  onClick={() => router.push("/notifications-cmc")}/>
                </Badge>
              </IconButton>
              <IconButton aria-label="profile" color="inherit" onClick={() => router.push("/profile")}>
                <AccountCircleIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', py: 4 }}>
        <Box sx={{ width: '20%', borderRight: 1, borderColor: 'divider', py: 4 }}>
          <List>
            {notificationsData.map(notification => (
              <ListItem placeholder="Select Notification" key={notification.id} button onClick={() => handleNotificationSelect(notification)}>
                <ListItemText primary={notification.subject} secondary={notification.user} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ flex: 1, padding: '20px', py: 6 }}>
          {selectedNotification ? (
            <div>
              {/* Can add other attributes like type or status from request table */}
              <Typography variant="h4">{selectedNotification.subject}</Typography>
              <Typography variant="subtitle1">From: {selectedNotification.user}</Typography><br></br>
              <Typography>{selectedNotification.description}</Typography>
            </div>
          ) : (
            <Typography variant="h6" align="center">Select a notification</Typography>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default NotificationsCMCPage;
