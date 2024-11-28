import { collection, getDocs } from "firebase/firestore";
import { database } from "@/firebase";
import { BillingPosition } from "@/types/types";

export const getBillingPositions = async () => {
  const billingPositions = await getDocs(collection(database, "billingPositions"));
  return billingPositions.docs.map((doc) => doc.data()) as BillingPosition[];
};