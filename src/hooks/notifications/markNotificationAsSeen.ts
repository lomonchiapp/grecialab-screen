import { setDoc, collection, doc } from "firebase/firestore";
import { database } from "@/firebase"

export const markNotificationAsSeen = async (notificationId: string | undefined) => {
  if (!notificationId) return;
  const notificationsRef = collection(database, "notifications");
  await setDoc(doc(notificationsRef, notificationId), { seen: true });
};
