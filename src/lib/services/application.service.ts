import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { LoanApplication } from "../models/application.model";

const COL = "applications";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const toApp = (id: string, data: Record<string, unknown>): LoanApplication =>
  ({ id, ...data } as LoanApplication);

// ─── Writes ───────────────────────────────────────────────────────────────────

/** Create a new application with a caller-supplied document ID (= loanId). */
export const createApplication = (id: string, data: Omit<LoanApplication, "id">) =>
  setDoc(doc(db, COL, id), data);

/** Partial update — only the supplied fields are written. */
export const updateApplication = (id: string, data: Partial<LoanApplication>) =>
  updateDoc(doc(db, COL, id), data as Record<string, unknown>);

/** Hard-delete an application document. Use with caution. */
export const deleteApplication = (id: string) =>
  deleteDoc(doc(db, COL, id));

// ─── One-time Reads ───────────────────────────────────────────────────────────

/** Fetch a single application by document ID. Returns null if not found. */
export const getApplication = async (id: string): Promise<LoanApplication | null> => {
  const snap = await getDoc(doc(db, COL, id));
  console.log(`[application.service] getApplication: id=${id}, exists=${snap.exists()}`);
  return snap.exists() ? toApp(snap.id, snap.data()) : null;
};

/** Fetch all applications ordered by creation date (newest first). */
export const getAllApplications = async (): Promise<LoanApplication[]> => {
  console.log("[application.service] getAllApplications: Fetching from Firestore...");
  const snap = await getDocs(query(collection(db, COL), orderBy("createdAt", "desc")));
  const apps = snap.docs.map((d) => toApp(d.id, d.data()));
  console.log(`[application.service] getAllApplications: Found ${apps.length} documents`);
  return apps;
};

/** Fetch all applications that match a specific status string. */
export const getApplicationsByStatus = async (status: string): Promise<LoanApplication[]> => {
  const snap = await getDocs(
    query(collection(db, COL), where("status", "==", status), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => toApp(d.id, d.data()));
};

// ─── Real-time Subscriptions ──────────────────────────────────────────────────

/** Subscribe to all applications (ordered newest-first). Fires on every change. */
export const subscribeToApplications = (
  callback: (apps: LoanApplication[]) => void,
  onError?: (err: Error) => void
): Unsubscribe => {
  // No orderBy here — orderBy silently drops the entire snapshot if any
  // document is missing the 'createdAt' field (e.g. manually seeded docs).
  // Sorting is done client-side so a single bad doc never blocks the list.
  return onSnapshot(
    collection(db, COL),
    (snap) => {
      const apps = snap.docs
        .map((d) => toApp(d.id, d.data()))
        .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
      callback(apps);
    },
    (err) => {
      console.error("[subscribeToApplications] onSnapshot error:", err);
      onError?.(err);
    }
  );
};

/** Subscribe to a single application document. Fires whenever it changes. */
export const subscribeToApplication = (
  id: string,
  callback: (app: LoanApplication | null) => void
): Unsubscribe =>
  onSnapshot(doc(db, COL, id), (snap) =>
    callback(snap.exists() ? toApp(snap.id, snap.data()) : null)
  );

/** Subscribe to applications filtered by status. */
export const subscribeToApplicationsByStatus = (
  status: string,
  callback: (apps: LoanApplication[]) => void
): Unsubscribe => {
  const q = query(
    collection(db, COL),
    where("status", "==", status),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => toApp(d.id, d.data())))
  );
};
/** Find application by Phone and PAN (used when user forgets ID) */
export const findApplicationByPhoneAndPan = async (phone: string, pan: string): Promise<LoanApplication | null> => {
  const snap = await getDocs(
    query(
      collection(db, COL), 
      where("basicDetails.phone", "==", phone), 
      where("kycDetails.panNumber", "==", pan.toUpperCase())
    )
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  return toApp(d.id, d.data());
};
