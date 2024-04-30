import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { AppBar, Toolbar, IconButton, Badge, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { Notifications as NotificationsIcon, subject } from '@mui/icons-material';
import supabase from "../../config/supabaseClient";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PropertyIcon from "@mui/icons-material/Category";


const notificationsData = [
  { id: 1, subject: "An update on your request has been made", from: "CMC", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." },
  { id: 2, subject: "Reservation Confirmation", from: "CMC", description: "Lorem ipsum dolor sit amet, consectetur..." },
  // COULD DO {SUBJECT, TYPE, STATUS, DESCRIPTION} FOR REQUESTS IF NOTIFICATIONS IS MOSTLY USED FOR REQUESTS 
  // REPLACE WITH ACTUAL BACKEND
];

const NotificationsPage = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notificationsData, setNotificationsData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try{
      const {
        data: { user },
      } = await supabase.auth.getUser();
    }
    catch(error){
      console.error("Error fetching user: ", error.message);
    }
    try{
        if (user.position == "daily_op"){
            let { data: notifications, error } = await supabase
            .from('requests')
            .select('*')
            .eq('type', "Maintenane")
            .or('type', 'eq', 'Access')
            .or('type', 'eq', 'Renovation')
            .or('type', 'eq', 'Violation');
            setNotificationsData(notifications);
        }
        else{
            let { data: notifications, error } = await supabase
            .from('requests')
            .select('*')
            .eq('type', );
            setNotificationsData(notifications);
        }
    }
    catch(error){
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
    router.push("/dashboard");
  };



  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Notifications
          </Typography>
          <IconButton color="inherit">
            {/* Show number of notifications */}
            <Badge badgeContent={notificationsData.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={goToDashboard}>
            {/* dashboard Button */}
              <PropertyIcon />
          </IconButton>
          <IconButton color="inherit" onClick={goToProfile}>
            {/* Profile Button */}
              <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        <Box sx={{ width: '20%', borderRight: 1, borderColor: 'divider' }}>
          <List>
            {notificationsData.map(notification => (
              <ListItem placeholder="Select Notification" key={notification.id} button onClick={() => handleNotificationSelect(notification)}>
                <ListItemText primary={notification.subject} secondary={notification.from} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ flex: 1, padding: '20px' }}>
          {selectedNotification ? (
            <div>
              {/* Can add other attributes like type or status from request table */}
              <Typography variant="h4">{selectedNotification.subject}</Typography>
              <Typography variant="subtitle1">From: {selectedNotification.from}</Typography><br></br>
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

export default NotificationsPage;
