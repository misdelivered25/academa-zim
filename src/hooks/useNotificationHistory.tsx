import { useState, useCallback, useEffect } from 'react';
import { NotificationType } from './useNotificationSounds';

export interface NotificationHistoryItem {
  id: string;
  title: string;
  description?: string;
  type: 'info' | 'warning' | 'error' | 'success';
  soundType?: NotificationType;
  timestamp: Date;
  dismissed: boolean;
}

const STORAGE_KEY = 'notification_history';
const MAX_HISTORY = 50;

export const useNotificationHistory = () => {
  const [history, setHistory] = useState<NotificationHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
      }
      return [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addNotification = useCallback((
    title: string,
    description?: string,
    type: 'info' | 'warning' | 'error' | 'success' = 'info',
    soundType?: NotificationType
  ) => {
    const newItem: NotificationHistoryItem = {
      id: crypto.randomUUID(),
      title,
      description,
      type,
      soundType,
      timestamp: new Date(),
      dismissed: false,
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY);
      return updated;
    });

    return newItem;
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, dismissed: true } : item
      )
    );
  }, []);

  const dismissAll = useCallback(() => {
    setHistory((prev) =>
      prev.map((item) => ({ ...item, dismissed: true }))
    );
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const getFilteredHistory = useCallback((
    filters: {
      types?: Array<'info' | 'warning' | 'error' | 'success'>;
      startDate?: Date;
      endDate?: Date;
      showDismissed?: boolean;
    }
  ) => {
    return history.filter((item) => {
      if (filters.types && filters.types.length > 0 && !filters.types.includes(item.type)) {
        return false;
      }
      if (filters.startDate && item.timestamp < filters.startDate) {
        return false;
      }
      if (filters.endDate && item.timestamp > filters.endDate) {
        return false;
      }
      if (!filters.showDismissed && item.dismissed) {
        return false;
      }
      return true;
    });
  }, [history]);

  return {
    history,
    addNotification,
    dismissNotification,
    dismissAll,
    clearHistory,
    getFilteredHistory,
  };
};
