import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../firebase/config";

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
  createdAt: string;
}

const COL = "notifications";

// ─── Dummy data — shown when Firestore collection is empty ────────────────────

export const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: "dummy_1",
    title: "New Application Submitted",
    message: "Rahul Sharma submitted a loan application for ₹50,000.",
    read: false,
    type: "info",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),   // 5 min ago
  },
  {
    id: "dummy_2",
    title: "Repayment Received",
    message: "Priya Nair made a repayment of ₹20,625 (UTR: UTR639040005678).",
    read: false,
    type: "success",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),  // 30 min ago
  },
  {
    id: "dummy_3",
    title: "KYC Pending Review",
    message: "Sunita Verma's KYC documents are awaiting verification.",
    read: false,
    type: "warning",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hrs ago
  },
  {
    id: "dummy_4",
    title: "Loan Disbursed",
    message: "Arjun Patel's loan of ₹30,000 has been marked as disbursed.",
    read: true,
    type: "success",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hrs ago
  },
  {
    id: "dummy_5",
    title: "High-Value Repayment",
    message: "A repayment of ₹14,000 from loan L-48271 needs approval.",
    read: true,
    type: "warning",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toNotification = (id: string, data: Record<string, unknown>): Notification => ({
  id,
  title:     (data.title   as string) ?? "",
  message:   (data.message as string) ?? "",
  read:      (data.read    as boolean) ?? false,
  type:      (data.type    as Notification["type"]) ?? "info",
  createdAt: (data.createdAt as string) ?? new Date().toISOString(),
});

// ─── One-time fetch ───────────────────────────────────────────────────────────

export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const snap = await getDocs(query(collection(db, COL), orderBy("createdAt", "desc")));
    if (snap.empty) return DUMMY_NOTIFICATIONS;
    return snap.docs.map((d) => toNotification(d.id, d.data()));
  } catch {
    // Firestore collection may not exist yet — fall back to dummy data
    return DUMMY_NOTIFICATIONS;
  }
};

// ─── Real-time subscription ───────────────────────────────────────────────────

export const subscribeToNotifications = (
  callback: (notifications: Notification[]) => void
): Unsubscribe => {
  try {
    const q = query(collection(db, COL), orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snap) => {
        if (snap.empty) {
          callback(DUMMY_NOTIFICATIONS);
        } else {
          callback(snap.docs.map((d) => toNotification(d.id, d.data())));
        }
      },
      () => {
        // Permission error or collection doesn't exist — use dummy data
        callback(DUMMY_NOTIFICATIONS);
      }
    );
  } catch {
    callback(DUMMY_NOTIFICATIONS);
    return () => {};
  }
};

// ─── Mark as read ─────────────────────────────────────────────────────────────

export const markNotificationAsRead = async (id: string): Promise<void> => {
  // Skip Firestore write for dummy notifications
  if (id.startsWith("dummy_")) return;
  try {
    await updateDoc(doc(db, COL, id), { read: true });
  } catch {
    // Silently ignore — UI state is already updated optimistically
  }
};

export const markAllNotificationsAsRead = async (ids: string[]): Promise<void> => {
  const realIds = ids.filter((id) => !id.startsWith("dummy_"));
  await Promise.all(realIds.map((id) => updateDoc(doc(db, COL, id), { read: true })));
};
