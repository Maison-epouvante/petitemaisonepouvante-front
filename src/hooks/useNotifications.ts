import { useState, useEffect, useCallback } from 'react';
import { notificationsApi } from '../api';
import type { Notification } from '../types';

export const useNotifications = (userId: number | null) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const response = await notificationsApi.getByUser(userId);
      setNotifications(response.data);
    } catch {
      // silently fail if service is unavailable
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markRead = async (id: number) => {
    try {
      await notificationsApi.markRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch {/* ignore */}
  };

  const markAllRead = async () => {
    if (!userId) return;
    try {
      await notificationsApi.markAllRead(userId);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch {/* ignore */}
  };

  const deleteNotification = async (id: number) => {
    try {
      await notificationsApi.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch {/* ignore */}
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return { notifications, loading, unreadCount, markRead, markAllRead, deleteNotification, refetch: fetchNotifications };
};
