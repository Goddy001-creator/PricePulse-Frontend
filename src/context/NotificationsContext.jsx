import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { getTopDiscounts } from "../services/api";

const STORAGE_KEY = "pricepulse_read_notifications";

function loadReadIds() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(loadReadIds);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const data = await getTopDiscounts(10);

      const items = (data.products || [])
        .filter((product) => product.discount_percent)
        .map((product) => ({
          id: `discount-${product.id}-${product.discount_percent}`,
          productId: product.id,
          productName: product.product_name,
          imageUrl: product.image_url,
          storeName: product.store_name,
          price: product.current_price,
          discount: product.discount_percent,
        }));

      setNotifications(items);
    } catch (requestError) {
      console.error("Notifications loading failed:", requestError);
      setError(true);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(readIds.slice(-200)));
    } catch {}
  }, [readIds]);

  const markRead = useCallback((id) => {
    setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const markAllRead = useCallback(() => {
    setReadIds((prev) => [
      ...new Set([...prev, ...notifications.map((item) => item.id)]),
    ]);
  }, [notifications]);

  const value = useMemo(
    () => ({
      notifications,
      readIds,
      unreadCount: notifications.filter((item) => !readIds.includes(item.id)).length,
      loading,
      error,
      markRead,
      markAllRead,
      reload: loadNotifications,
    }),
    [notifications, readIds, loading, error, markRead, markAllRead, loadNotifications]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error("useNotifications must be used inside NotificationsProvider");
  }

  return context;
}