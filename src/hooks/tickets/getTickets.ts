import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { database } from "@/firebase";
import { Ticket } from "@/types/types";

// Get tickets from firebase in real time
export const getTickets = () => {
  let tickets: Ticket[] = [];
  const unsubscribe = onSnapshot(collection(database, "tickets"), (snapshot) => {
    tickets = snapshot.docs.map((doc) => doc.data()) as Ticket[];
  });
  return unsubscribe;
};