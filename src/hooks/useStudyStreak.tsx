import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredStreak: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalStudyDays: number;
  lastStudyDate: string | null;
  achievements: Achievement[];
  loading: boolean;
  todayStudied: boolean;
}

const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  { id: 'starter', name: 'Getting Started', description: 'Complete your first study session', icon: '🌱', requiredStreak: 1 },
  { id: 'three-day', name: 'Three Day Warrior', description: 'Study 3 days in a row', icon: '🔥', requiredStreak: 3 },
  { id: 'week-warrior', name: 'Week Warrior', description: 'Study 7 days in a row', icon: '⚡', requiredStreak: 7 },
  { id: 'fortnight', name: 'Fortnight Focus', description: 'Study 14 days in a row', icon: '🎯', requiredStreak: 14 },
  { id: 'monthly-master', name: 'Monthly Master', description: 'Study 30 days in a row', icon: '🏆', requiredStreak: 30 },
  { id: 'quarter-champion', name: 'Quarter Champion', description: 'Study 90 days in a row', icon: '👑', requiredStreak: 90 },
  { id: 'legendary', name: 'Legendary Scholar', description: 'Study 365 days in a row', icon: '🌟', requiredStreak: 365 },
];

export function useStudyStreak(): StreakData {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [totalStudyDays, setTotalStudyDays] = useState(0);
  const [lastStudyDate, setLastStudyDate] = useState<string | null>(null);
  const [todayStudied, setTodayStudied] = useState(false);

  const calculateStreak = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch all study sessions for the user, ordered by date
      const { data: sessions, error } = await (supabase as any)
        .from('study_sessions')
        .select('session_date, hours')
        .eq('user_id', user.id)
        .order('session_date', { ascending: false });

      if (error) throw error;

      if (!sessions || sessions.length === 0) {
        setCurrentStreak(0);
        setLongestStreak(0);
        setTotalStudyDays(0);
        setLastStudyDate(null);
        setTodayStudied(false);
        setLoading(false);
        return;
      }

      // Get unique study dates
      const uniqueDatesSet = new Set<string>();
      sessions
        .filter((s: any) => s.hours && s.hours > 0)
        .forEach((s: any) => {
          const date = s.session_date?.split('T')[0];
          if (date) uniqueDatesSet.add(date);
        });
      
      const uniqueDates = Array.from(uniqueDatesSet).sort((a, b) => 
        new Date(b).getTime() - new Date(a).getTime()
      );

      setTotalStudyDays(uniqueDates.length);
      setLastStudyDate(uniqueDates[0] || null);

      // Check if studied today
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      setTodayStudied(uniqueDates.includes(today));

      // Calculate current streak
      let streak = 0;
      let checkDate = uniqueDates.includes(today) ? today : yesterday;
      
      // If neither today nor yesterday has a study session, streak is 0
      if (!uniqueDates.includes(today) && !uniqueDates.includes(yesterday)) {
        setCurrentStreak(0);
      } else {
        for (let i = 0; i < uniqueDates.length; i++) {
          if (uniqueDates[i] === checkDate) {
            streak++;
            // Move to previous day
            const prevDate = new Date(checkDate);
            prevDate.setDate(prevDate.getDate() - 1);
            checkDate = prevDate.toISOString().split('T')[0];
          } else if (new Date(uniqueDates[i]) < new Date(checkDate)) {
            // Gap in dates, streak is broken
            break;
          }
        }
        setCurrentStreak(streak);
      }

      // Calculate longest streak
      let maxStreak = 0;
      let tempStreak = 1;
      
      const sortedDatesAsc = [...uniqueDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      
      for (let i = 1; i < sortedDatesAsc.length; i++) {
        const prevDate = new Date(sortedDatesAsc[i - 1]);
        const currDate = new Date(sortedDatesAsc[i]);
        const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / 86400000);
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          maxStreak = Math.max(maxStreak, tempStreak);
          tempStreak = 1;
        }
      }
      maxStreak = Math.max(maxStreak, tempStreak);
      
      if (uniqueDates.length === 1) {
        maxStreak = 1;
      }
      
      setLongestStreak(maxStreak);
    } catch (error) {
      console.error('Error calculating streak:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    calculateStreak();
  }, [calculateStreak]);

  // Generate achievements based on current streak
  const achievements: Achievement[] = ACHIEVEMENTS.map(achievement => ({
    ...achievement,
    unlocked: longestStreak >= achievement.requiredStreak,
    unlockedAt: longestStreak >= achievement.requiredStreak ? 'Unlocked!' : undefined,
  }));

  return {
    currentStreak,
    longestStreak,
    totalStudyDays,
    lastStudyDate,
    achievements,
    loading,
    todayStudied,
  };
}

export default useStudyStreak;
