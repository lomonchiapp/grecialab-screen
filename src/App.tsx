import { useEffect, useState } from 'react';
import { Screen } from '@/Screen';
import { useScreenState } from '@/global/useScreenState';
import { Notification } from '@/types/types';

function App() {
  const { 
    subscribeToVideos, 
    subscribeToQueues, 
    subscribeToTickets, 
    subscribeToServices, 
    subscribeToNotifications,
    subscribeToBillingPositions,
    subscribeToUsers,
    notifications
  } = useScreenState();

  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  useEffect(() => {
    const unsubscribers = [
      subscribeToTickets(),
      subscribeToQueues(),
      subscribeToVideos(),
      subscribeToServices(),
      subscribeToNotifications(),
      subscribeToBillingPositions(),
      subscribeToUsers()
    ];

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [subscribeToTickets, subscribeToQueues, subscribeToVideos, subscribeToServices, subscribeToNotifications, subscribeToBillingPositions, subscribeToUsers]);

  useEffect(() => {
    const unprocessedNotifications = notifications.filter(notification => !notification.seen);
    if (unprocessedNotifications.length > 0) {
      setCurrentNotification(unprocessedNotifications[0]);
      setIsNotificationVisible(true);
      
      const timer = setTimeout(() => {
        setIsNotificationVisible(false);
        setCurrentNotification(null);
        // Here you should mark the notification as seen in your database
      }, 5500);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  return (
    <div className="w-full h-full">
      <Screen 
        currentNotification={currentNotification}
        isNotificationVisible={isNotificationVisible}
      />
    </div>
  );
}

export default App;

