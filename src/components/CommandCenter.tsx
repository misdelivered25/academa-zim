import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Target,
  Trophy,
  CalendarClock,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type Assignment = {
  id: string;
  title: string;
  due_date: string | null;
  status: string | null;
  course_id: string | null;
};
type Course = { id: string; course_name: string };
type StudySession = {
  course_id: string | null;
  hours: number | null;
  session_date: string | null;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function daysUntil(date: string | null): number | null {
  if (!date) return null;
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / DAY_MS);
}

export default function CommandCenter() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const [a, c, s] = await Promise.all([
        supabase
          .from("assignments")
          .select("id, title, due_date, status, course_id")
          .eq("user_id", user.id),
        supabase
          .from("courses")
          .select("id, course_name")
          .eq("user_id", user.id),
        supabase
          .from("study_sessions")
          .select("course_id, hours, session_date")
          .eq("user_id", user.id)
          .order("session_date", { ascending: false })
          .limit(40),
      ]);
      if (cancelled) return;
      setAssignments(a.data ?? []);
      setCourses(c.data ?? []);
      setSessions(s.data ?? []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const courseName = (id: string | null) =>
    courses.find((c) => c.id === id)?.course_name ?? "General";

  const pending = useMemo(
    () => assignments.filter((a) => a.status !== "completed"),
    [assignments],
  );

  const topTasks = useMemo(
    () =>
      [...pending]
        .sort((a, b) => {
          const da = a.due_date
            ? new Date(a.due_date).getTime()
            : Number.MAX_SAFE_INTEGER;
          const db = b.due_date
            ? new Date(b.due_date).getTime()
            : Number.MAX_SAFE_INTEGER;
          return da - db;
        })
        .slice(0, 3),
    [pending],
  );

  const upcoming = useMemo(
    () =>
      pending
        .filter((a) => {
          const d = daysUntil(a.due_date);
          return d !== null && d >= 0 && d <= 7;
        })
        .sort(
          (a, b) =>
            new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime(),
        )
        .slice(0, 4),
    [pending],
  );

  const riskAssignment = useMemo(
    () =>
      pending.find((a) => {
        const d = daysUntil(a.due_date);
        return d !== null && d <= 1;
      }) ?? null,
    [pending],
  );

  // Recommendation: course with least recent study hours (last 14 days)
  const recommendation = useMemo(() => {
    if (courses.length === 0) return null;
    const cutoff = Date.now() - 14 * DAY_MS;
    const hoursByCourse = new Map<string, number>();
    for (const c of courses) hoursByCourse.set(c.id, 0);
    for (const s of sessions) {
      if (!s.course_id || !s.session_date) continue;
      if (new Date(s.session_date).getTime() < cutoff) continue;
      hoursByCourse.set(
        s.course_id,
        (hoursByCourse.get(s.course_id) ?? 0) + (s.hours ?? 0),
      );
    }
    let minId: string | null = null;
    let minHrs = Infinity;
    for (const [id, h] of hoursByCourse.entries()) {
      if (h < minHrs) {
        minHrs = h;
        minId = id;
      }
    }
    if (!minId) return null;
    const name = courses.find((c) => c.id === minId)?.course_name;
    return name
      ? `Spend 45 min on ${name} today — only ${
        minHrs.toFixed(1)
      }h in the past 2 weeks.`
      : null;
  }, [courses, sessions]);

  // Quick win: nearest small task (no due date or far future, lower priority)
  const quickWin = useMemo(
    () => pending.find((a) => !a.due_date) ?? topTasks[topTasks.length - 1],
    [pending, topTasks],
  );

  if (loading) {
    return (
      <Card className="glass-card border-border/30">
        <CardContent className="p-6 text-sm text-muted-foreground">
          Loading your command center…
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-primary/30 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
      <CardHeader className="relative">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Academic Command Center
          </CardTitle>
          <Button asChild size="sm" variant="outline" className="h-8">
            <Link to="/study-planner">
              Study planner <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4">
        {/* Risk warning */}
        {riskAssignment && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-semibold text-destructive">
                At risk: {riskAssignment.title}
              </div>
              <div className="text-muted-foreground">
                {courseName(riskAssignment.course_id)} •{" "}
                {(() => {
                  const d = daysUntil(riskAssignment.due_date);
                  if (d === null) return "Due soon";
                  if (d < 0) return `Overdue by ${Math.abs(d)} day(s)`;
                  if (d === 0) return "Due today";
                  return "Due tomorrow";
                })()}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top tasks today */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold">
              <Target className="h-4 w-4 text-primary" /> Today's top tasks
            </div>
            {topTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing pending. Nice work.
              </p>
            ) : (
              <ul className="space-y-2">
                {topTasks.map((t) => {
                  const d = daysUntil(t.due_date);
                  return (
                    <li
                      key={t.id}
                      className="flex items-center justify-between gap-2 rounded-md bg-background/40 px-3 py-2 text-sm"
                    >
                      <span className="truncate">{t.title}</span>
                      <Badge
                        variant={d !== null && d < 1 ? "destructive" : "secondary"}
                        className="shrink-0"
                      >
                        {d === null
                          ? "no date"
                          : d < 0
                          ? `${Math.abs(d)}d late`
                          : d === 0
                          ? "today"
                          : `${d}d`}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Upcoming deadlines */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold">
              <CalendarClock className="h-4 w-4 text-secondary" /> Next 7 days
            </div>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Calendar's clear for the next week.
              </p>
            ) : (
              <ul className="space-y-2">
                {upcoming.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between gap-2 rounded-md bg-background/40 px-3 py-2 text-sm"
                  >
                    <span className="truncate">{t.title}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {new Date(t.due_date!).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Recommendation + Quick win */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendation && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
              <div className="flex items-center gap-2 font-semibold text-primary mb-1">
                <Sparkles className="h-4 w-4" /> Study recommendation
              </div>
              <p className="text-muted-foreground">{recommendation}</p>
            </div>
          )}
          {quickWin && (
            <div className="rounded-lg border border-secondary/30 bg-secondary/5 p-3 text-sm">
              <div className="flex items-center gap-2 font-semibold text-secondary mb-1">
                <Trophy className="h-4 w-4" /> Quick win
              </div>
              <p className="text-muted-foreground truncate">
                Knock out: {quickWin.title}
              </p>
            </div>
          )}
        </div>

        {pending.length === 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            You're all caught up.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
