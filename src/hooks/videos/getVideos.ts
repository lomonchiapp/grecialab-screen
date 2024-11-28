import { collection, getDocs } from "firebase/firestore";
import { database } from "@/firebase";
import { Video } from "@/types/types";

export const getVideos = async () => {
  const videos = await getDocs(collection(database, "videos"));
  return videos.docs.map((doc) => doc.data()) as Video[];
};