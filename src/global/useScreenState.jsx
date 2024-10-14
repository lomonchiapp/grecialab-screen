import { create } from "zustand";
import { collection, onSnapshot } from "firebase/firestore";
import { database } from "../firebase";

export const useScreenState = create((set) => ({
    queues: [],
    billingPositions: [],
    tickets: [],
    videos: [],
    services: [],
    notifications: [],
    setVideos: (videos) => set({ videos }),
    setNotifications: (notifications) => set({ notifications }),
    setQueues: (queues) => set({ queues }),
    setTickets: (tickets) => set({ tickets }),
    setBillingPositions: (billingPositions) => set({ billingPositions }),
    setServices: (services) => set({ services }),
    subscribeToTickets: () => {
        const q = collection(database, "tickets");
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          set({ tickets: data });
          console.log("Tickets data:", data);
        });
        return unsubscribe;
      },
    subscribeToQueues: () => {
        const q = collection(database, "queues");
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          set({ queues: data });
          console.log("Queues data:", data);
        });
        return unsubscribe;
      },
    subscribeToServices: () => {
        const q = collection(database, "services");
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          set({ services: data });
          console.log("Services data:", data);
        });
        return unsubscribe;
      },
    subscribeToVideos: () => {
        const q = collection(database, "videos");
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          set({ videos: data });
          console.log("Videos data:", data);
        });
        return unsubscribe;
      },
    subscribeToBillingPositions: () => {
        const q = collection(database, "billingPositions");
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          set({ billingPositions: data });
          console.log("Billing positions data:", data);
        });
        return unsubscribe;
      },
    subscribeToNotifications: () => {
        const q = collection(database, "notifications");
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          set({ notifications: data });
          console.log("Notifications data:", data);
        });
        return unsubscribe;
      },
}));
