import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { Loan, LoanStatus } from "../models/loan.model";

const COL = "loans";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const toLoan = (id: string, data: Record<string, unknown>): Loan =>
  ({ id, ...data } as Loan);

// ─── Writes ───────────────────────────────────────────────────────────────────

/**
 * Create a loan document.
 * Call this from admin.controller after approveLoan() + disburseLoan().
 * Document ID = loanId (e.g. "L-48271") for easy cross-collection lookups.
 */
export const createLoan = (id: string, data: Omit<Loan, "id">) =>
  setDoc(doc(db, COL, id), data);

/** Partial update — used to deduct remainingBalance on repayment, or close a loan. */
export const updateLoan = (id: string, data: Partial<Loan>) =>
  updateDoc(doc(db, COL, id), data as Record<string, unknown>);

// ─── One-time Reads ───────────────────────────────────────────────────────────

/** Fetch a single loan by document ID. Returns null if not found. */
export const getLoan = async (id: string): Promise<Loan | null> => {
  const snap = await getDoc(doc(db, COL, id));
  return snap.exists() ? toLoan(snap.id, snap.data()) : null;
};

/** Fetch all loans ordered by disbursement date (newest first). */
export const getAllLoans = async (): Promise<Loan[]> => {
  const snap = await getDocs(query(collection(db, COL), orderBy("disbursedAt", "desc")));
  return snap.docs.map((d) => toLoan(d.id, d.data()));
};

/** Fetch all loans for a specific borrower. */
export const getLoansByUser = async (userId: string): Promise<Loan[]> => {
  const snap = await getDocs(
    query(collection(db, COL), where("userId", "==", userId), orderBy("disbursedAt", "desc"))
  );
  return snap.docs.map((d) => toLoan(d.id, d.data()));
};

/** Fetch all loans with a specific status ("active" | "closed" | "defaulted"). */
export const getLoansByStatus = async (status: LoanStatus): Promise<Loan[]> => {
  const snap = await getDocs(
    query(collection(db, COL), where("status", "==", status), orderBy("disbursedAt", "desc"))
  );
  return snap.docs.map((d) => toLoan(d.id, d.data()));
};

// ─── Real-time Subscriptions ──────────────────────────────────────────────────

/** Subscribe to all loans. Fires on every change — useful for admin dashboard. */
export const subscribeToLoans = (
  callback: (loans: Loan[]) => void
): Unsubscribe => {
  const q = query(collection(db, COL), orderBy("disbursedAt", "desc"));
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => toLoan(d.id, d.data())))
  );
};

/** Subscribe to all active loans only. */
export const subscribeToActiveLoans = (
  callback: (loans: Loan[]) => void
): Unsubscribe => {
  const q = query(
    collection(db, COL),
    where("status", "==", "active"),
    orderBy("disbursedAt", "desc")
  );
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => toLoan(d.id, d.data())))
  );
};

/** Subscribe to a single loan document (live balance updates for user dashboard). */
export const subscribeToLoan = (
  id: string,
  callback: (loan: Loan | null) => void
): Unsubscribe =>
  onSnapshot(doc(db, COL, id), (snap) =>
    callback(snap.exists() ? toLoan(snap.id, snap.data()) : null)
  );
