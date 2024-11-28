import { collection, getDocs } from "firebase/firestore";
import { database } from "@/firebase";
import { User } from "@/types/types";

export const getUsers = async () => {
  const users = await getDocs(collection(database, "users"));
  return users.docs.map((doc) => doc.data()) as User[];
};