import { useEffect, useCallback } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { useNotificationSounds } from '@/hooks/useNotificationSounds';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Bell, BellOff, Volume2, VolumeX, Play } from 'lucide-react';

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

  const {
    preferences: soundPreferences,
    setPreferences: setSoundPreferences,
    testSound,
  } = useNotificationSounds();

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
            'success',
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
              'success',
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

  const soundTypes: Array<{ key: keyof typeof soundPreferences.tones; label: string; description: string }> = [
    { key: 'deadline', label: 'Deadline Alerts', description: 'Assignment due date reminders' },
    { key: 'success', label: 'Success', description: 'Task completions and achievements' },
    { key: 'info', label: 'Information', description: 'General updates and information' },
    { key: 'warning', label: 'Warnings', description: 'Important notices' },
    { key: 'error', label: 'Errors', description: 'Error messages and failures' },
    { key: 'ai_suggestion', label: 'AI Suggestions', description: 'Study recommendations from AI' },
  ];

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
      <CardContent className="space-y-6">
        {/* Notification Types */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Notification Settings</h3>
          
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
        </div>

        <Separator />

        {/* Sound Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Sound Settings</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setSoundPreferences({ enabled: !soundPreferences.enabled })
              }
            >
              {soundPreferences.enabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
          </div>

          {soundPreferences.enabled && (
            <>
              {/* Volume Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="volume" className="text-sm">
                    Volume
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(soundPreferences.volume * 100)}%
                  </span>
                </div>
                <Slider
                  id="volume"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[soundPreferences.volume]}
                  onValueChange={(value) =>
                    setSoundPreferences({ volume: value[0] })
                  }
                  className="w-full"
                />
              </div>

              <Separator />

              {/* Individual Sound Toggles */}
              <div className="space-y-3">
                <Label className="text-sm">Alert Tones</Label>
                {soundTypes.map((sound) => (
                  <div
                    key={sound.key}
                    className="flex items-center justify-between space-x-2"
                  >
                    <div className="flex-1 space-y-0.5">
                      <div className="text-sm font-medium">{sound.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {sound.description}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => testSound(sound.key)}
                        disabled={!soundPreferences.tones[sound.key]}
                        className="h-8 w-8 p-0"
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                      <Switch
                        checked={soundPreferences.tones[sound.key]}
                        onCheckedChange={(checked) =>
                          setSoundPreferences({
                            tones: {
                              ...soundPreferences.tones,
                              [sound.key]: checked,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {permission === 'denied' && (
          <>
            <Separator />
            <div className="text-xs text-destructive">
              Browser notifications are blocked. Please enable them in your browser settings.
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
