import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { differenceInHours, differenceInMinutes, isPast, parseISO } from 'date-fns';
import { useNotificationSounds, NotificationType } from './useNotificationSounds';
import { useNotificationHistory } from './useNotificationHistory';

interface Assignment {
  id: string;
  title: string;
  due_date: string | null;
  status: string | null;
}

interface NotificationPreferences {
  enableBrowserNotifications: boolean;
  enableInAppNotifications: boolean;
  enableAIReminders: boolean;
}

export const useNotifications = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enableBrowserNotifications: true,
    enableInAppNotifications: true,
    enableAIReminders: true,
  });
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const { playNotificationSound } = useNotificationSounds();
  const notificationHistory = useNotificationHistory();

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestBrowserPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast.error('Browser notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast.success('Browser notifications enabled!');
        return true;
      } else {
        toast.error('Browser notifications denied');
        return false;
      }
    }

    return false;
  }, []);

  const sendBrowserNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!preferences.enableBrowserNotifications || Notification.permission !== 'granted') {
      return;
    }

    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
    } catch (error) {
      console.error('Error sending browser notification:', error);
    }
  }, [preferences.enableBrowserNotifications]);

  const sendInAppNotification = useCallback((title: string, description?: string, type: 'info' | 'warning' | 'error' | 'success' = 'info', soundType?: NotificationType) => {
    // Always add to history
    const finalSoundType = soundType || (type as NotificationType);
    notificationHistory.addNotification(title, description, type, finalSoundType);

    if (!preferences.enableInAppNotifications) {
      return;
    }

    const toastFn = type === 'error' ? toast.error : 
                    type === 'warning' ? toast.warning : 
                    type === 'success' ? toast.success : toast.info;

    toastFn(title, { description });

    // Play notification sound
    if (soundType) {
      playNotificationSound(soundType);
    } else {
      // Map toast type to sound type
      const soundMap: Record<typeof type, NotificationType> = {
        'info': 'info',
        'warning': 'warning',
        'error': 'error',
        'success': 'success',
      };
      playNotificationSound(soundMap[type]);
    }
  }, [preferences.enableInAppNotifications, playNotificationSound, notificationHistory]);

  const checkAssignmentDeadlines = useCallback(async (userId: string) => {
    try {
      const { data: assignments, error } = await supabase
        .from('assignments')
        .select('id, title, due_date, status')
        .eq('user_id', userId)
        .not('status', 'eq', 'completed')
        .not('due_date', 'is', null)
        .order('due_date', { ascending: true });

      if (error) throw error;

      const now = new Date();
      const notifiedKey = 'notified_assignments';
      const notified = JSON.parse(localStorage.getItem(notifiedKey) || '{}');

      assignments?.forEach((assignment: Assignment) => {
        if (!assignment.due_date) return;

        const dueDate = parseISO(assignment.due_date);
        if (isPast(dueDate)) return;

        const hoursUntilDue = differenceInHours(dueDate, now);
        const minutesUntilDue = differenceInMinutes(dueDate, now);

        // 24-hour warning
        if (hoursUntilDue <= 24 && hoursUntilDue > 23 && !notified[`${assignment.id}_24h`]) {
          sendInAppNotification(
            '⏰ Assignment Due Soon!',
            `"${assignment.title}" is due in 24 hours`,
            'warning',
            'deadline'
          );
          sendBrowserNotification('Assignment Due Soon!', {
            body: `"${assignment.title}" is due in 24 hours`,
            tag: `assignment_${assignment.id}_24h`,
          });
          notified[`${assignment.id}_24h`] = true;
        }

        // 3-hour warning
        if (hoursUntilDue <= 3 && hoursUntilDue > 2 && !notified[`${assignment.id}_3h`]) {
          sendInAppNotification(
            '⚠️ Assignment Due in 3 Hours!',
            `"${assignment.title}" needs your attention`,
            'warning',
            'deadline'
          );
          sendBrowserNotification('Assignment Due in 3 Hours!', {
            body: `"${assignment.title}" needs your attention`,
            tag: `assignment_${assignment.id}_3h`,
            requireInteraction: true,
          });
          notified[`${assignment.id}_3h`] = true;
        }

        // 1-hour warning
        if (minutesUntilDue <= 60 && minutesUntilDue > 55 && !notified[`${assignment.id}_1h`]) {
          sendInAppNotification(
            '🚨 Urgent: Assignment Due Soon!',
            `"${assignment.title}" is due in 1 hour`,
            'error',
            'deadline'
          );
          sendBrowserNotification('Urgent: Assignment Due Soon!', {
            body: `"${assignment.title}" is due in 1 hour`,
            tag: `assignment_${assignment.id}_1h`,
            requireInteraction: true,
          });
          notified[`${assignment.id}_1h`] = true;
        }

        // 15-minute final warning
        if (minutesUntilDue <= 15 && minutesUntilDue > 10 && !notified[`${assignment.id}_15m`]) {
          sendInAppNotification(
            '🔥 FINAL WARNING: 15 Minutes Left!',
            `"${assignment.title}" is almost due!`,
            'error',
            'deadline'
          );
          sendBrowserNotification('FINAL WARNING: 15 Minutes Left!', {
            body: `"${assignment.title}" is almost due!`,
            tag: `assignment_${assignment.id}_15m`,
            requireInteraction: true,
          });
          notified[`${assignment.id}_15m`] = true;
        }
      });

      localStorage.setItem(notifiedKey, JSON.stringify(notified));
    } catch (error) {
      console.error('Error checking assignment deadlines:', error);
    }
  }, [sendInAppNotification, sendBrowserNotification]);

  const getAIRecommendations = useCallback(async (userId: string) => {
    if (!preferences.enableAIReminders) return;

    try {
      const { data, error } = await supabase.functions.invoke('smart-notifications', {
        body: { userId, action: 'analyze' }
      });

      if (error) throw error;

      if (data?.recommendations?.length > 0) {
        data.recommendations.forEach((rec: any) => {
          sendInAppNotification(
            '💡 AI Study Suggestion',
            rec.message,
            'info',
            'ai_suggestion'
          );
        });
      }
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
    }
  }, [preferences.enableAIReminders, sendInAppNotification]);

  return {
    preferences,
    setPreferences,
    permission,
    requestBrowserPermission,
    sendBrowserNotification,
    sendInAppNotification,
    checkAssignmentDeadlines,
    getAIRecommendations,
    notificationHistory,
  };
};
