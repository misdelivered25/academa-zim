import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Sparkles,
  Loader2,
  Trash2,
  RefreshCw,
  CalendarRange,
} from "lucide-react";

type Plan = {
  id: string;
  title: string;
  week_start: string;
  status: string;
  ai_summary: string | null;
  created_at: string;
};
type PlanItem = {
  id: string;
  plan_id: string;
  day_of_week: number;
  start_time: string | null;
  duration_minutes: number;
  title: string;
  description: string | null;
  completed: boolean;
  course_id: string | null;
  assignment_id: string | null;
  position: number;
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function nextSunday(): string {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay()); // current week's Sunday
  return d.toISOString().slice(0, 10);
}

export default function StudyPlanner() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [items, setItems] = useState<PlanItem[]>([]);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [focusNotes, setFocusNotes] = useState("");

  const loadPlans = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("study_plans")
      .select("*")
      .order("week_start", { ascending: false });
    setPlans(data ?? []);
    if (data && data.length && !activePlanId) setActivePlanId(data[0].id);
    setLoading(false);
  };

  const loadItems = async (planId: string) => {
    const { data } = await supabase
      .from("study_plan_items")
      .select("*")
      .eq("plan_id", planId)
      .order("day_of_week", { ascending: true })
      .order("position", { ascending: true });
    setItems(data ?? []);
  };

  useEffect(() => {
    loadPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (activePlanId) loadItems(activePlanId);
    else setItems([]);
  }, [activePlanId]);

  const generate = async () => {
    if (!user) return;
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-study-plan",
        { body: { weekStart: nextSunday(), focusNotes } },
      );
      if (error) throw error;
      toast({
        title: "Plan ready",
        description: data?.summary?.slice(0, 140) ?? "Your weekly plan is live.",
      });
      setFocusNotes("");
      await loadPlans();
      if (data?.plan_id) setActivePlanId(data.plan_id);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Could not generate plan";
      toast({ title: "Generation failed", description: msg, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const toggleItem = async (item: PlanItem) => {
    const next = !item.completed;
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              completed: next,
            }
          : i,
      ),
    );
    await supabase
      .from("study_plan_items")
      .update({
        completed: next,
        completed_at: next ? new Date().toISOString() : null,
      })
      .eq("id", item.id);
  };

  const deletePlan = async (id: string) => {
    if (!confirm("Delete this plan and all its items?")) return;
    await supabase.from("study_plans").delete().eq("id", id);
    toast({ title: "Plan deleted" });
    if (activePlanId === id) setActivePlanId(null);
    loadPlans();
  };

  const archivePlan = async (id: string) => {
    await supabase
      .from("study_plans")
      .update({ status: "completed" })
      .eq("id", id);
    toast({ title: "Plan marked complete" });
    loadPlans();
  };

  const itemsByDay = DAY_LABELS.map((_, day) =>
    items.filter((i) => i.day_of_week === day),
  );
  const active = plans.find((p) => p.id === activePlanId);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-primary" />
              AI Study Planner
            </h1>
            <p className="text-muted-foreground text-sm">
              Generate a weekly plan from your courses, deadlines, and study
              history.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Generate a new plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="Optional: what should this week focus on? (e.g. exam prep for Maths, finish lab report)"
              value={focusNotes}
              onChange={(e) => setFocusNotes(e.target.value)}
              maxLength={1000}
              rows={3}
            />
            <Button onClick={generate} disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate weekly plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Your plans</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {loading && (
                <p className="text-sm text-muted-foreground">Loading…</p>
              )}
              {!loading && plans.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No plans yet. Generate one above.
                </p>
              )}
              {plans.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActivePlanId(p.id)}
                  className={`w-full text-left p-3 rounded-md border transition ${
                    activePlanId === p.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent/40"
                  }`}
                >
                  <div className="text-sm font-medium truncate">{p.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <CalendarRange className="h-3 w-3" />
                    {new Date(p.week_start).toLocaleDateString()}
                  </div>
                  <Badge variant="outline" className="mt-2 text-[10px]">
                    {p.status}
                  </Badge>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <CardTitle className="text-base">
                    {active?.title ?? "Select a plan"}
                  </CardTitle>
                  {active?.ai_summary && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {active.ai_summary}
                    </p>
                  )}
                </div>
                {active && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => archivePlan(active.id)}
                      disabled={active.status === "completed"}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Mark complete
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deletePlan(active.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!active && (
                <p className="text-sm text-muted-foreground">
                  Pick a plan or generate a new one.
                </p>
              )}
              {active && items.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No items in this plan.
                </p>
              )}
              {active && items.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {itemsByDay.map((dayItems, day) =>
                    dayItems.length === 0 ? null : (
                      <div
                        key={day}
                        className="rounded-lg border border-border/50 p-3 bg-background/40"
                      >
                        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                          {DAY_LABELS[day]}
                        </div>
                        <ul className="space-y-2">
                          {dayItems.map((it) => (
                            <li
                              key={it.id}
                              className="flex items-start gap-2 text-sm"
                            >
                              <Checkbox
                                checked={it.completed}
                                onCheckedChange={() => toggleItem(it)}
                                className="mt-0.5"
                              />
                              <div
                                className={`flex-1 ${
                                  it.completed
                                    ? "opacity-60 line-through"
                                    : ""
                                }`}
                              >
                                <div className="font-medium">{it.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {it.start_time
                                    ? `${it.start_time.slice(0, 5)} • `
                                    : ""}
                                  {it.duration_minutes} min
                                </div>
                                {it.description && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {it.description}
                                  </div>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ),
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
