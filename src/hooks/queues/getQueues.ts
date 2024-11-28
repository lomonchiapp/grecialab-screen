import { collection, onSnapshot } from "firebase/firestore";
import { database } from "@/firebase";
import { Queue } from "@/types/types";

export const getQueues = () => {
  let queues: Queue[] = [];
  const unsubscribe = onSnapshot(collection(database, "queues"), (snapshot) => {
    queues = snapshot.docs.map((doc) => doc.data()) as Queue[];
  });
  return unsubscribe;
};