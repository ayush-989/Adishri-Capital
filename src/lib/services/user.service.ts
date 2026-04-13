import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import type { AppUser } from "../models/user.model";

const COL = "users";

export const getUser = async (uid: string): Promise<AppUser | null> => {
  const snap = await getDoc(doc(db, COL, uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    uid,
    email: data.email ?? null,
    phoneNumber: data.phoneNumber ?? null,
    role: data.role ?? "user",
  };
};

export const createUser = (uid: string, data: Omit<AppUser, "uid">) =>
  setDoc(doc(db, COL, uid), data);

export const getUserCount = async (): Promise<number> => {
  const snap = await getDocs(collection(db, COL));
  return snap.size;
};
