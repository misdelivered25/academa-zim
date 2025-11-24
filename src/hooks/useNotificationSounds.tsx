import { useCallback, useEffect, useState } from 'react';

export type NotificationType = 'deadline' | 'success' | 'info' | 'warning' | 'error' | 'ai_suggestion';

interface SoundPreferences {
  enabled: boolean;
  volume: number;
  tones: Record<NotificationType, boolean>;
}

const defaultPreferences: SoundPreferences = {
  enabled: true,
  volume: 0.5,
  tones: {
    deadline: true,
    success: true,
    info: true,
    warning: true,
    error: true,
    ai_suggestion: true,
  },
};

const STORAGE_KEY = 'notification_sound_preferences';

// Sound frequencies for different notification types
const soundProfiles: Record<NotificationType, { frequencies: number[]; duration: number; pattern: 'single' | 'double' | 'triple' }> = {
  deadline: { frequencies: [800, 1000], duration: 200, pattern: 'double' },
  success: { frequencies: [523, 659, 784], duration: 150, pattern: 'triple' },
  info: { frequencies: [440], duration: 200, pattern: 'single' },
  warning: { frequencies: [600, 500], duration: 250, pattern: 'double' },
  error: { frequencies: [300, 250], duration: 300, pattern: 'double' },
  ai_suggestion: { frequencies: [650, 800], duration: 180, pattern: 'double' },
};

export const useNotificationSounds = () => {
  const [preferences, setPreferencesState] = useState<SoundPreferences>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences;
    } catch {
      return defaultPreferences;
    }
  });

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      setAudioContext(new AudioContext());
    }
    return () => {
      audioContext?.close();
    };
  }, []);

  const setPreferences = useCallback((newPreferences: Partial<SoundPreferences>) => {
    setPreferencesState((prev) => {
      const updated = { ...prev, ...newPreferences };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const playTone = useCallback(
    (frequency: number, duration: number, delay: number = 0) => {
      if (!audioContext || !preferences.enabled) return;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      const startTime = audioContext.currentTime + delay;
      const endTime = startTime + duration / 1000;

      // Attack and release envelope for smoother sound
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(preferences.volume, startTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(preferences.volume, endTime - 0.05);
      gainNode.gain.linearRampToValueAtTime(0, endTime);

      oscillator.start(startTime);
      oscillator.stop(endTime);
    },
    [audioContext, preferences.enabled, preferences.volume]
  );

  const playNotificationSound = useCallback(
    (type: NotificationType) => {
      if (!preferences.enabled || !preferences.tones[type] || !audioContext) return;

      const profile = soundProfiles[type];
      const { frequencies, duration, pattern } = profile;

      if (pattern === 'single') {
        playTone(frequencies[0], duration);
      } else if (pattern === 'double') {
        playTone(frequencies[0], duration, 0);
        playTone(frequencies[1], duration, duration / 1000 + 0.05);
      } else if (pattern === 'triple') {
        playTone(frequencies[0], duration, 0);
        playTone(frequencies[1], duration, duration / 1000 + 0.05);
        playTone(frequencies[2], duration, (duration / 1000 + 0.05) * 2);
      }
    },
    [audioContext, preferences.enabled, preferences.tones, playTone]
  );

  const testSound = useCallback(
    (type: NotificationType) => {
      playNotificationSound(type);
    },
    [playNotificationSound]
  );

  return {
    preferences,
    setPreferences,
    playNotificationSound,
    testSound,
  };
};
