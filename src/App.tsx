import { useEffect, useState } from 'react';
import { Screen } from '@/Screen';
import { useScreenState } from '@/global/useScreenState';
import { Notification } from '@/types/types';
import { updateDoc, doc } from 'firebase/firestore';
import { database } from '@/firebase';

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
      const notificationToShow = unprocessedNotifications[0];
      setCurrentNotification(notificationToShow);
      setIsNotificationVisible(true);
      
      const timer = setTimeout(() => {
        setIsNotificationVisible(false);
        
        // Separar la actualización de la base de datos del cierre de la notificación
        if (notificationToShow.id) {
          updateNotificationSeen(notificationToShow.id);
        }
        
        // Limpiar la notificación actual un poco después
        setTimeout(() => {
          setCurrentNotification(null);
        }, 500); // Pequeño retraso para suavizar la transición
      }, 5500);
  
      return () => clearTimeout(timer);
    }
  }, [notifications]);
  
  // Función para actualizar solo el campo seen
  const updateNotificationSeen = async (notificationId: string) => {
    try {
      const notificationRef = doc(database, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        seen: true
      });
    } catch (error) {
      console.error("Error updating notification seen status:", error);
    }
  };
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

