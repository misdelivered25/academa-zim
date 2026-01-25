import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  BookOpen,
  Settings,
  Volume2,
  VolumeX
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type TimerMode = "focus" | "shortBreak" | "longBreak";

interface TimerSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
}

const DEFAULT_SETTINGS: TimerSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
};

const PomodoroTimer = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(settings.focusMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartRef = useRef<Date | null>(null);

  const getModeMinutes = useCallback((m: TimerMode) => {
    switch (m) {
      case "focus": return settings.focusMinutes;
      case "shortBreak": return settings.shortBreakMinutes;
      case "longBreak": return settings.longBreakMinutes;
    }
  }, [settings]);

  // Initialize timer when mode changes
  useEffect(() => {
    setTimeLeft(getModeMinutes(mode) * 60);
    setIsRunning(false);
  }, [mode, getModeMinutes]);

  // Timer countdown
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const playCompletionSound = useCallback(() => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }, [soundEnabled]);

  const saveStudySession = useCallback(async (durationMinutes: number) => {
    if (!user) return;
    
    try {
      await (supabase as any)
        .from('study_sessions')
        .insert({
          user_id: user.id,
          hours: durationMinutes / 60,
          session_date: new Date().toISOString().split('T')[0],
        });
    } catch (error) {
      console.error("Error saving study session:", error);
    }
  }, [user]);

  const handleTimerComplete = useCallback(async () => {
    setIsRunning(false);
    playCompletionSound();

    if (mode === "focus") {
      const newCompleted = completedSessions + 1;
      setCompletedSessions(newCompleted);
      
      // Save study session
      await saveStudySession(settings.focusMinutes);
      
      toast.success("Focus session complete!", {
        description: `Great job! You've completed ${newCompleted} session${newCompleted > 1 ? 's' : ''} today.`
      });

      // Determine next break type
      if (newCompleted % settings.sessionsBeforeLongBreak === 0) {
        setMode("longBreak");
        toast.info("Time for a long break!", { description: "You've earned it!" });
      } else {
        setMode("shortBreak");
        toast.info("Short break time!", { description: "Take a quick rest." });
      }
    } else {
      toast.success("Break's over!", { description: "Ready to focus again?" });
      setMode("focus");
    }
  }, [mode, completedSessions, settings, playCompletionSound, saveStudySession]);

  const toggleTimer = () => {
    if (!isRunning && mode === "focus") {
      sessionStartRef.current = new Date();
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getModeMinutes(mode) * 60);
    sessionStartRef.current = null;
  };

  const switchMode = (newMode: TimerMode) => {
    if (isRunning) {
      setIsRunning(false);
    }
    setMode(newMode);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalSeconds = getModeMinutes(mode) * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  const getModeColor = () => {
    switch (mode) {
      case "focus": return "bg-primary";
      case "shortBreak": return "bg-green-500";
      case "longBreak": return "bg-blue-500";
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case "focus": return <BookOpen className="h-5 w-5" />;
      case "shortBreak": 
      case "longBreak": return <Coffee className="h-5 w-5" />;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getModeIcon()}
            Pomodoro Timer
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="h-8 w-8"
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Timer Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm">Focus: {settings.focusMinutes} min</Label>
                      <Slider
                        value={[settings.focusMinutes]}
                        onValueChange={([v]) => setSettings(s => ({ ...s, focusMinutes: v }))}
                        min={1}
                        max={60}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Short Break: {settings.shortBreakMinutes} min</Label>
                      <Slider
                        value={[settings.shortBreakMinutes]}
                        onValueChange={([v]) => setSettings(s => ({ ...s, shortBreakMinutes: v }))}
                        min={1}
                        max={30}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Long Break: {settings.longBreakMinutes} min</Label>
                      <Slider
                        value={[settings.longBreakMinutes]}
                        onValueChange={([v]) => setSettings(s => ({ ...s, longBreakMinutes: v }))}
                        min={5}
                        max={60}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Sessions before long break: {settings.sessionsBeforeLongBreak}</Label>
                      <Slider
                        value={[settings.sessionsBeforeLongBreak]}
                        onValueChange={([v]) => setSettings(s => ({ ...s, sessionsBeforeLongBreak: v }))}
                        min={2}
                        max={8}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Tabs */}
        <div className="flex gap-2 justify-center">
          <Button
            variant={mode === "focus" ? "default" : "outline"}
            size="sm"
            onClick={() => switchMode("focus")}
            className={mode === "focus" ? "bg-primary" : ""}
          >
            Focus
          </Button>
          <Button
            variant={mode === "shortBreak" ? "default" : "outline"}
            size="sm"
            onClick={() => switchMode("shortBreak")}
            className={mode === "shortBreak" ? "bg-green-500 hover:bg-green-600" : ""}
          >
            Short Break
          </Button>
          <Button
            variant={mode === "longBreak" ? "default" : "outline"}
            size="sm"
            onClick={() => switchMode("longBreak")}
            className={mode === "longBreak" ? "bg-blue-500 hover:bg-blue-600" : ""}
          >
            Long Break
          </Button>
        </div>

        {/* Timer Display */}
        <div className="text-center">
          <div className="text-7xl font-bold font-mono tracking-tight text-foreground">
            {formatTime(timeLeft)}
          </div>
          <Badge variant="outline" className="mt-2">
            {mode === "focus" ? "Stay focused!" : "Take a break"}
          </Badge>
        </div>

        {/* Progress Bar */}
        <Progress value={getProgress()} className={`h-2 ${getModeColor()}`} />

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            onClick={toggleTimer}
            className={`w-32 ${isRunning ? "bg-yellow-500 hover:bg-yellow-600" : getModeColor()}`}
          >
            {isRunning ? (
              <>
                <Pause className="mr-2 h-5 w-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                Start
              </>
            )}
          </Button>
          <Button variant="outline" size="lg" onClick={resetTimer}>
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset
          </Button>
        </div>

        {/* Session Counter */}
        <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
          <span>Sessions completed today:</span>
          <Badge variant="secondary" className="font-bold">
            {completedSessions}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroTimer;
