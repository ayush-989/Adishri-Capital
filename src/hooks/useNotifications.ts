import { useState, useEffect, useCallback } from "react";
import {
  subscribeToNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type Notification,
} from "../lib/services/notification.service";

interface UseNotificationsResult {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export function useNotifications(): UseNotificationsResult {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToNotifications((data) => {
      setNotifications(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Optimistic update — flip read=true locally, then persist
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    markNotificationAsRead(id);
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    markAllNotificationsAsRead(unreadIds);
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead };
}
