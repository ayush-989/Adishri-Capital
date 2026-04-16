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
import type { Transaction } from "../models/transaction.model";

const COL = "transactions";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const toTxn = (id: string, data: Record<string, unknown>): Transaction =>
  ({ id, ...data } as Transaction);

// ─── Writes ───────────────────────────────────────────────────────────────────

/** Create a transaction with a caller-supplied document ID (= txnId). */
export const createTransaction = (id: string, data: Omit<Transaction, "id">) =>
  setDoc(doc(db, COL, id), data);

/** Partial update on any transaction fields. */
export const updateTransaction = (id: string, data: Partial<Transaction>) =>
  updateDoc(doc(db, COL, id), data as Record<string, unknown>);

/**
 * Mark a transaction as verified.
 * Shorthand used by both admin.controller and repayment flows.
 */
export const verifyTransaction = (id: string) =>
  updateDoc(doc(db, COL, id), { verified: true });

// ─── One-time Reads ───────────────────────────────────────────────────────────

/** Fetch a single transaction by document ID. Returns null if not found. */
export const getTransaction = async (id: string): Promise<Transaction | null> => {
  const snap = await getDoc(doc(db, COL, id));
  return snap.exists() ? toTxn(snap.id, snap.data()) : null;
};

/** Fetch all transactions across all loans. */
export const getAllTransactions = async (): Promise<Transaction[]> => {
  console.log("[transaction.service] getAllTransactions: Fetching from Firestore...");
  const snap = await getDocs(query(collection(db, COL), orderBy("createdAt", "desc")));
  const txns = snap.docs.map((d) => toTxn(d.id, d.data()));
  console.log(`[transaction.service] getAllTransactions: Found ${txns.length} documents`);
  return txns;
};

/** Fetch all transactions (fee + repayment) for a specific loan. */
export const getAllByLoanId = async (loanId: string): Promise<Transaction[]> => {
  const snap = await getDocs(
    query(collection(db, COL), where("loanId", "==", loanId), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => toTxn(d.id, d.data()));
};

/**
 * Fetch the processing-fee transaction for a loan.
 * Returns null if the user hasn't submitted payment yet.
 */
export const getFeeTransactionByLoanId = async (loanId: string): Promise<Transaction | null> => {
  console.log(`[transaction.service] getFeeTransactionByLoanId: loanId=${loanId}`);
  const snap = await getDocs(
    query(collection(db, COL), where("loanId", "==", loanId), where("type", "==", "fee"))
  );
  const result = snap.empty ? null : toTxn(snap.docs[0].id, snap.docs[0].data());
  console.log(`[transaction.service] getFeeTransactionByLoanId: found=${!!result}`);
  return result;
};

/**
 * Fetch all unverified repayments (one-time snapshot).
 * Use subscribeToPendingRepayments for real-time updates.
 */
export const getPendingRepayments = async (): Promise<Transaction[]> => {
  const snap = await getDocs(
    query(
      collection(db, COL),
      where("type", "==", "repayment"),
      where("verified", "==", false)
    )
  );
  return snap.docs.map((d) => toTxn(d.id, d.data()));
};

/**
 * Fetch all unverified processing-fee transactions.
 * Useful for the admin dashboard pending-fee count.
 */
export const getPendingFees = async (): Promise<Transaction[]> => {
  const snap = await getDocs(
    query(
      collection(db, COL),
      where("type", "==", "fee"),
      where("verified", "==", false)
    )
  );
  return snap.docs.map((d) => toTxn(d.id, d.data()));
};

// ─── Real-time Subscriptions ──────────────────────────────────────────────────

/** Subscribe to all unverified repayments. Used by usePendingRepayments hook. */
export const subscribeToPendingRepayments = (
  callback: (txns: Transaction[]) => void
): Unsubscribe => {
  console.log("[transaction.service] subscribeToPendingRepayments: Starting subscription...");
  const q = query(
    collection(db, COL),
    where("type", "==", "repayment"),
    where("verified", "==", false)
  );
  return onSnapshot(q, (snap) => {
    console.log(`[transaction.service] subscribeToPendingRepayments: snapshot received, ${snap.docs.length} docs`);
    callback(snap.docs.map((d) => toTxn(d.id, d.data())));
  });
};

/** Subscribe to all transactions for a specific loan (live repayment history). */
export const subscribeToTransactionsByLoan = (
  loanId: string,
  callback: (txns: Transaction[]) => void
): Unsubscribe => {
  const q = query(
    collection(db, COL),
    where("loanId", "==", loanId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => toTxn(d.id, d.data())))
  );
};
