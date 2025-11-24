import { useEffect, useCallback } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, BellOff } from 'lucide-react';

export const NotificationManager = () => {
  const { user } = useAuth();
  const {
    preferences,
    setPreferences,
    permission,
    requestBrowserPermission,
    sendInAppNotification,
    checkAssignmentDeadlines,
    getAIRecommendations,
  } = useNotifications();

  // Check deadlines every 5 minutes
  useEffect(() => {
    if (!user?.id) return;

    const checkDeadlines = () => {
      checkAssignmentDeadlines(user.id);
    };

    // Check immediately
    checkDeadlines();

    // Then check every 5 minutes
    const interval = setInterval(checkDeadlines, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user?.id, checkAssignmentDeadlines]);

  // Get AI recommendations every hour
  useEffect(() => {
    if (!user?.id || !preferences.enableAIReminders) return;

    const getRecommendations = () => {
      getAIRecommendations(user.id);
    };

    // Get recommendations after 2 minutes (delay initial load)
    const timeout = setTimeout(getRecommendations, 2 * 60 * 1000);

    // Then get every hour
    const interval = setInterval(getRecommendations, 60 * 60 * 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [user?.id, preferences.enableAIReminders, getAIRecommendations]);

  // Listen to realtime assignment changes
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('assignment_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'assignments',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          sendInAppNotification(
            '✨ New Assignment Added!',
            `"${payload.new.title}" has been added to your assignments`,
            'success'
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'assignments',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new.status === 'completed' && payload.old.status !== 'completed') {
            sendInAppNotification(
              '🎉 Assignment Completed!',
              `Great job completing "${payload.new.title}"!`,
              'success'
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, sendInAppNotification]);

  const handleToggleBrowserNotifications = useCallback(async () => {
    if (permission === 'granted') {
      setPreferences(prev => ({
        ...prev,
        enableBrowserNotifications: !prev.enableBrowserNotifications,
      }));
    } else {
      const granted = await requestBrowserPermission();
      if (granted) {
        setPreferences(prev => ({
          ...prev,
          enableBrowserNotifications: true,
        }));
      }
    }
  }, [permission, requestBrowserPermission, setPreferences]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Smart Notifications
        </CardTitle>
        <CardDescription>
          Manage your notification preferences and stay on top of deadlines
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">Browser Notifications</div>
            <div className="text-xs text-muted-foreground">
              Get notified even when the app is closed
            </div>
          </div>
          <Button
            variant={preferences.enableBrowserNotifications ? "default" : "outline"}
            size="sm"
            onClick={handleToggleBrowserNotifications}
          >
            {preferences.enableBrowserNotifications ? (
              <Bell className="h-4 w-4" />
            ) : (
              <BellOff className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">In-App Notifications</div>
            <div className="text-xs text-muted-foreground">
              Show notifications within the app
            </div>
          </div>
          <Button
            variant={preferences.enableInAppNotifications ? "default" : "outline"}
            size="sm"
            onClick={() =>
              setPreferences(prev => ({
                ...prev,
                enableInAppNotifications: !prev.enableInAppNotifications,
              }))
            }
          >
            {preferences.enableInAppNotifications ? (
              <Bell className="h-4 w-4" />
            ) : (
              <BellOff className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">AI Study Reminders</div>
            <div className="text-xs text-muted-foreground">
              Get personalized study suggestions based on your patterns
            </div>
          </div>
          <Button
            variant={preferences.enableAIReminders ? "default" : "outline"}
            size="sm"
            onClick={() =>
              setPreferences(prev => ({
                ...prev,
                enableAIReminders: !prev.enableAIReminders,
              }))
            }
          >
            {preferences.enableAIReminders ? (
              <Bell className="h-4 w-4" />
            ) : (
              <BellOff className="h-4 w-4" />
            )}
          </Button>
        </div>

        {permission === 'denied' && (
          <div className="text-xs text-destructive">
            Browser notifications are blocked. Please enable them in your browser settings.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
