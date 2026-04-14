import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { Transaction } from "../models/transaction.model";

const COL = "transactions";

export const createTransaction = (id: string, data: Omit<Transaction, "id">) =>
  setDoc(doc(db, COL, id), data);

export const getTransaction = async (id: string): Promise<Transaction | null> => {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Transaction;
};

export const updateTransaction = (id: string, data: Partial<Transaction>) =>
  updateDoc(doc(db, COL, id), data as Record<string, unknown>);

export const getFeeTransactionByLoanId = async (loanId: string): Promise<Transaction | null> => {
  const q = query(collection(db, COL), where("loanId", "==", loanId), where("type", "==", "fee"));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Transaction;
};

export const subscribeToPendingRepayments = (
  callback: (txns: Transaction[]) => void
): Unsubscribe => {
  const q = query(
    collection(db, COL),
    where("type", "==", "repayment"),
    where("verified", "==", false)
  );
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Transaction)))
  );
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Transaction));
};
