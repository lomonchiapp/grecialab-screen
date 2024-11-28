import { create } from "zustand";
import { database } from "@/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Ticket, Queue, Service, BillingPosition, Video, User, Notification } from "@/types/types";

interface ScreenState {
  services: Service[];
  queues: Queue[];
  tickets: Ticket[];
  videos: Video[];
  notifications: Notification[];
  billingPositions: BillingPosition[];
  users: User[];
  subscribeToTickets: () => () => void;
  subscribeToQueues: () => () => void;
  subscribeToServices: () => () => void;
  subscribeToVideos: () => () => void;
  subscribeToBillingPositions: () => () => void;
  subscribeToUsers: () => () => void;
  subscribeToNotifications: () => () => void;
}

export const useScreenState = create<ScreenState>((set) => ({
  notifications: [],
  services: [],
  selectedServices: [],
  queues: [],
  billingPositions: [],
  videos: [],
  selectedQueues: [],
  users: [],
  tickets: [],
  selectedTicket: null,
  setVideos: (videos: Video[]) => set({ videos }),
  setServices: (services: Service[]) => set({ services }),
  setBillingPositions: (billingPositions: BillingPosition[]) => set({ billingPositions }),
  setTickets: (tickets: Ticket[]) => set({ tickets }),
  setQueues: (queues: Queue[]) => set({ queues }),
  setUsers: (users: User[]) => set({ users }),
  
  // Firestore Subscription
  subscribeToTickets: () => {
    return onSnapshot(collection(database, "tickets"), (snapshot) => {
      const tickets = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Ticket[];
      set({ tickets });
    });
  },
  subscribeToQueues: () => {
    return onSnapshot(collection(database, "queues"), (snapshot) => {
      const queues = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Queue[];
      set({ queues });
    });
  },
  subscribeToNotifications: () => {
    return onSnapshot(collection(database, "notifications"), (snapshot) => {
      const notifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      set({ notifications });
    });
  },
  subscribeToServices: () => {
    return onSnapshot(collection(database, "services"), (snapshot) => {
      const services = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
      set({ services });
    });
  },
  subscribeToVideos: () => {
    return onSnapshot(collection(database, "videos"), (snapshot) => {
      const videos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Video[];
      set({ videos });
    });
  },
  subscribeToBillingPositions: () => {
    return onSnapshot(collection(database, "billingPositions"), (snapshot) => {
      const billingPositions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as BillingPosition[];
      set({ billingPositions });
    });
  },
  subscribeToUsers: () => {
    return onSnapshot(collection(database, "users"), (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      set({ users });
    });
  }
}));
