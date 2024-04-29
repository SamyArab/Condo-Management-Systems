import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Badge, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { Notifications as NotificationsIcon, subject } from '@mui/icons-material';
import supabase from "../../config/supabaseClient";


const notificationsData = [
  { id: 1, subject: "An update on your request has been made",from:"CMC", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." },
  { id: 2, subject: "Reservation Confirmation",from:"CMC", description: "Lorem ipsum dolor sit amet, consectetur..." },
  // COULD DO {SUBJECT, TYPE, STATUS, DESCRIPTION} FOR REQUESTS IF NOTIFICATIONS IS MOSTLY USED FOR REQUESTS 
  // REPLACE WITH ACTUAL BACKEND
];

const {
  data: { user },
} = await supabase.auth.getUser();

const NotificationsPage = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notificationsData, setNotificationsData] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    let { data: notifications, error } = await supabase
      .from('requests')
      .select('*')
      .eq('user', user.email);

    if (error) console.error('Error fetching notifications:', error);
    else setNotificationsData(notifications);
  };

  const handleNotificationSelect = (notification) => {
    setSelectedNotification(notification);
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
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        <Box sx={{ width: '20%', borderRight: 1, borderColor: 'divider' }}>
          <List>
            {notificationsData.map(notification => (
              <ListItem key={notification.id} button onClick={() => handleNotificationSelect(notification)}>
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
