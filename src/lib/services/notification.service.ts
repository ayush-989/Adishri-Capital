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

const toNotification = (id: string, data: Record<string, unknown>): Notification => ({
  id,
  title:     (data.title     as string)                  ?? "",
  message:   (data.message   as string)                  ?? "",
  read:      (data.read      as boolean)                 ?? false,
  type:      (data.type      as Notification["type"])    ?? "info",
  createdAt: (data.createdAt as string)                  ?? new Date().toISOString(),
});

// ─── One-time fetch ───────────────────────────────────────────────────────────

export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const snap = await getDocs(query(collection(db, COL), orderBy("createdAt", "desc")));
    return snap.docs.map((d) => toNotification(d.id, d.data()));
  } catch {
    return [];
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
      (snap) => callback(snap.docs.map((d) => toNotification(d.id, d.data()))),
      () => callback([])
    );
  } catch {
    callback([]);
    return () => {};
  }
};

// ─── Mark as read ─────────────────────────────────────────────────────────────

export const markNotificationAsRead = async (id: string): Promise<void> => {
  try {
    await updateDoc(doc(db, COL, id), { read: true });
  } catch {
    // Silently ignore — UI state is already updated optimistically
  }
};

export const markAllNotificationsAsRead = async (ids: string[]): Promise<void> => {
  await Promise.all(ids.map((id) => updateDoc(doc(db, COL, id), { read: true })));
};
