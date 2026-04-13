import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { LoanApplication } from "../models/application.model";

const COL = "applications";

export const createApplication = (id: string, data: Omit<LoanApplication, "id">) =>
  setDoc(doc(db, COL, id), data);

export const getApplication = async (id: string): Promise<LoanApplication | null> => {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as LoanApplication;
};

export const updateApplication = (id: string, data: Partial<LoanApplication>) =>
  updateDoc(doc(db, COL, id), data as Record<string, unknown>);

export const getAllApplications = async (): Promise<LoanApplication[]> => {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as LoanApplication));
};

export const subscribeToApplications = (
  callback: (apps: LoanApplication[]) => void
): Unsubscribe => {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as LoanApplication)))
  );
};
