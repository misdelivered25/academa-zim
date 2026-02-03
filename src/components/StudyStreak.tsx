import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, Trophy, Calendar, Target, Sparkles } from "lucide-react";
import { useStudyStreak, Achievement } from "@/hooks/useStudyStreak";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AchievementBadge = ({ achievement }: { achievement: Achievement }) => {
  const nextAchievement = !achievement.unlocked;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`
              relative flex flex-col items-center justify-center p-3 rounded-xl
              transition-all duration-300 cursor-pointer
              ${achievement.unlocked 
                ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 shadow-lg shadow-primary/10' 
                : 'bg-muted/30 border border-border/30 opacity-50 grayscale'
              }
              ${achievement.unlocked ? 'hover:scale-105 hover:shadow-xl hover:shadow-primary/20' : 'hover:opacity-70'}
            `}
          >
            <span className="text-2xl mb-1">{achievement.icon}</span>
            <span className="text-xs font-medium text-center text-foreground/80 line-clamp-1">
              {achievement.name.split(' ')[0]}
            </span>
            {achievement.unlocked && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold">{achievement.name}</p>
            <p className="text-xs text-muted-foreground">{achievement.description}</p>
            {!achievement.unlocked && (
              <p className="text-xs text-primary">
                Need {achievement.requiredStreak} day streak to unlock
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const StreakFlame = ({ streak, todayStudied }: { streak: number; todayStudied: boolean }) => {
  const flameSize = Math.min(streak * 2 + 24, 64);
  const glowIntensity = Math.min(streak * 0.1, 1);
  
  return (
    <div className="relative">
      <div 
        className={`
          relative flex items-center justify-center
          ${streak > 0 ? 'animate-pulse' : ''}
        `}
        style={{
          filter: streak > 0 ? `drop-shadow(0 0 ${8 + streak}px hsl(var(--primary) / ${glowIntensity}))` : 'none',
        }}
      >
        <Flame 
          className={`
            transition-all duration-500
            ${streak > 0 ? 'text-orange-500' : 'text-muted-foreground/30'}
            ${streak >= 7 ? 'text-orange-400' : ''}
            ${streak >= 30 ? 'text-yellow-500' : ''}
          `}
          style={{ 
            width: flameSize, 
            height: flameSize,
          }}
          fill={streak > 0 ? 'currentColor' : 'none'}
        />
        {streak >= 7 && (
          <Sparkles 
            className="absolute -top-2 -right-2 h-5 w-5 text-yellow-400 animate-spin"
            style={{ animationDuration: '3s' }}
          />
        )}
      </div>
      {!todayStudied && streak > 0 && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-destructive/10 border-destructive/30 text-destructive">
            Study today!
          </Badge>
        </div>
      )}
    </div>
  );
};

export const StudyStreak = () => {
  const { 
    currentStreak, 
    longestStreak, 
    totalStudyDays, 
    achievements, 
    loading,
    todayStudied 
  } = useStudyStreak();

  // Find next achievement to unlock
  const nextAchievement = achievements.find(a => !a.unlocked);
  const progressToNext = nextAchievement 
    ? Math.min((currentStreak / nextAchievement.requiredStreak) * 100, 100)
    : 100;

  if (loading) {
    return (
      <Card className="glass-card border-border/30">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/30 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-yellow-500/5 pointer-events-none" />
      
      <CardHeader className="pb-2 relative">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Study Streak
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 relative">
        {/* Main Streak Display */}
        <div className="flex items-center gap-4">
          <StreakFlame streak={currentStreak} todayStudied={todayStudied} />
          
          <div className="flex-1 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">
                {currentStreak}
              </span>
              <span className="text-muted-foreground text-sm">
                day{currentStreak !== 1 ? 's' : ''} streak
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                Best: {longestStreak} days
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Total: {totalStudyDays} days
              </span>
            </div>
          </div>
        </div>

        {/* Progress to Next Achievement */}
        {nextAchievement && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Next: {nextAchievement.icon} {nextAchievement.name}
              </span>
              <span className="text-primary font-medium">
                {currentStreak}/{nextAchievement.requiredStreak} days
              </span>
            </div>
            <Progress 
              value={progressToNext} 
              className="h-2"
            />
          </div>
        )}

        {/* Achievements Grid */}
        <div className="pt-2">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Achievements</h4>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {achievements.map(achievement => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>

        {/* Motivational Message */}
        {currentStreak === 0 && (
          <div className="text-center py-2 px-4 rounded-lg bg-muted/30 border border-border/30">
            <p className="text-sm text-muted-foreground">
              Start studying today to begin your streak! 🚀
            </p>
          </div>
        )}
        
        {currentStreak > 0 && currentStreak < 7 && (
          <div className="text-center py-2 px-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <p className="text-sm text-foreground">
              {7 - currentStreak} more day{7 - currentStreak !== 1 ? 's' : ''} to become a Week Warrior! ⚡
            </p>
          </div>
        )}

        {currentStreak >= 7 && currentStreak < 30 && (
          <div className="text-center py-2 px-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
            <p className="text-sm text-foreground">
              Amazing! Keep going for Monthly Master! 🏆
            </p>
          </div>
        )}

        {currentStreak >= 30 && (
          <div className="text-center py-2 px-4 rounded-lg bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30">
            <p className="text-sm font-medium text-foreground">
              🌟 Incredible dedication! You're a true scholar! 🌟
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudyStreak;
