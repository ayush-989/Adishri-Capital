import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { AppUser } from "../models/user.model";

const COL = "users";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const toUser = (uid: string, data: Record<string, unknown>): AppUser => ({
  uid,
  email: (data.email as string) ?? null,
  phoneNumber: (data.phoneNumber as string) ?? null,
  role: (data.role as AppUser["role"]) ?? "user",
});

// ─── Writes ───────────────────────────────────────────────────────────────────

/** Create a user document. Document ID = Firebase Auth UID. */
export const createUser = (uid: string, data: Omit<AppUser, "uid">) =>
  setDoc(doc(db, COL, uid), data);

/** Partial update on a user document (e.g. promote to admin, update phone). */
export const updateUser = (uid: string, data: Partial<Omit<AppUser, "uid">>) =>
  updateDoc(doc(db, COL, uid), data as Record<string, unknown>);

// ─── One-time Reads ───────────────────────────────────────────────────────────

/** Fetch a single user by UID. Returns null if the document doesn't exist. */
export const getUser = async (uid: string): Promise<AppUser | null> => {
  const snap = await getDoc(doc(db, COL, uid));
  return snap.exists() ? toUser(snap.id, snap.data()) : null;
};

/** Fetch all users in the collection. */
export const getAllUsers = async (): Promise<AppUser[]> => {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map((d) => toUser(d.id, d.data()));
};

/** Fetch all users with a specific role ("user" | "admin"). */
export const getUsersByRole = async (role: AppUser["role"]): Promise<AppUser[]> => {
  const snap = await getDocs(query(collection(db, COL), where("role", "==", role)));
  return snap.docs.map((d) => toUser(d.id, d.data()));
};

/** Return the total number of user documents (used in dashboard stats). */
export const getUserCount = async (): Promise<number> => {
  console.log("[user.service] getUserCount: Fetching from Firestore...");
  const snap = await getDocs(collection(db, COL));
  console.log(`[user.service] getUserCount: Found ${snap.size} users`);
  return snap.size;
};

// ─── Real-time Subscriptions ──────────────────────────────────────────────────

/** Subscribe to all users. Fires on every add / update / delete. */
export const subscribeToUsers = (
  callback: (users: AppUser[]) => void
): Unsubscribe =>
  onSnapshot(collection(db, COL), (snap) =>
    callback(snap.docs.map((d) => toUser(d.id, d.data())))
  );
