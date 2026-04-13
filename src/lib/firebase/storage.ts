import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./config";

export const uploadFile = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};
