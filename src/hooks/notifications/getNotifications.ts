import { collection, onSnapshot } from "firebase/firestore";
import { database } from "@/firebase";
import { Notification } from "@/types/types";

export const getNotifications = () => {
  let notifications: Notification[] = [];
  const unsubscribe = onSnapshot(collection(database, "notifications"), (snapshot) => {
    notifications = snapshot.docs.map((doc) => doc.data()) as Notification[];
  });
  return unsubscribe;
};