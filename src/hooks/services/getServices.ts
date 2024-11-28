import { collection, getDocs } from "firebase/firestore";
import { database } from "@/firebase";
import { Service } from "@/types/types";

export const getServices = async () => {
  const services = await getDocs(collection(database, "services"));
  return services.docs.map((doc) => doc.data()) as Service[];
};