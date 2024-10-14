import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import {NotificationPopup} from './components/NotificationPopup'; // Ensure correct import path
import { Screen } from './Screen';
import { useScreenState } from './global/useScreenState';
import { updateDoc, doc } from 'firebase/firestore'; // Ensure correct import path
import {database as db} from './firebase'; // Ensure correct import path
import { ToBilling } from './components/NotificationPopup/ToBilling';

function App() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [notificationQueue, setNotificationQueue] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);
  const { notifications, subscribeToVideos, subscribeToQueues, subscribeToTickets, subscribeToServices, subscribeToNotifications } = useScreenState();

  useEffect(() => {
    const unsubscribeTickets = subscribeToTickets();
    const unsubscribeQueues = subscribeToQueues();
    const unsubscribeVideos = subscribeToVideos();
    const unsubscribeServices = subscribeToServices();
    const unsubscribeNotifications = subscribeToNotifications();

    return () => {
      unsubscribeTickets();
      unsubscribeQueues();
      unsubscribeVideos();
      unsubscribeServices();
      unsubscribeNotifications();
    };
  }, [subscribeToTickets, subscribeToQueues, subscribeToVideos, subscribeToServices, subscribeToNotifications]);

  useEffect(() => {
    const unprocessedNotifications = notifications.filter(notification => !notification.seen);

    if (unprocessedNotifications.length > 0) {
      setNotificationQueue(prevQueue => [...prevQueue, ...unprocessedNotifications]);
    }
  }, [notifications]);

  useEffect(() => {
    if (!isPopupOpen && notificationQueue.length > 0) {
      const nextNotification = notificationQueue[0];
      setCurrentNotification(nextNotification);
      setNotificationQueue(prevQueue => prevQueue.slice(1));
      setIsPopupOpen(true);

      // Update the seen status in Firestore
      const notificationDoc = doc(db, 'notifications', nextNotification.id);
      updateDoc(notificationDoc, { seen: true })
        .then(() => {
          console.log(`Notification ${nextNotification.id} marked as seen`);
        })
        .catch(error => {
          console.error(`Error updating notification ${nextNotification.id}:`, error);
        });
    }
  }, [notificationQueue, isPopupOpen]);

  useEffect(() => {
    if (isPopupOpen) {
      const timer = setTimeout(() => {
        setIsPopupOpen(false);
      }, 5500);

      return () => clearTimeout(timer);
    }
  }, [isPopupOpen]);

  useEffect(() => {
    if (currentNotification) {
      console.log("Current Notification:", currentNotification);
    } else {
      console.log("Current Notification: createdAt is undefined or null");
    }
  }, [currentNotification]);

  return (
    <Grid>
      <Screen />
      <NotificationPopup open={isPopupOpen} setOpen={setIsPopupOpen}>
        {currentNotification && (
          <ToBilling notification={currentNotification} />
        )}
      </NotificationPopup>
    </Grid>
  );
}

export default App;