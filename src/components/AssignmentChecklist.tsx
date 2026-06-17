import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  position: number;
}

interface AssignmentChecklistProps {
  assignmentId: string;
  assignmentTitle?: string;
  assignmentDescription?: string | null;
}

export default function AssignmentChecklist({
  assignmentId,
  assignmentTitle,
  assignmentDescription,
}: AssignmentChecklistProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("assignment_checklist_items")
      .select("id,label,completed,position")
      .eq("assignment_id", assignmentId)
      .order("position", { ascending: true });
    if (error) {
      console.error(error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (assignmentId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignmentId]);

  const addItem = async (label: string) => {
    if (!label.trim() || !user) return;
    const position = items.length;
    const { data, error } = await supabase
      .from("assignment_checklist_items")
      .insert({
        assignment_id: assignmentId,
        user_id: user.id,
        label: label.trim(),
        position,
      })
      .select("id,label,completed,position")
      .single();
    if (error) {
      toast({ title: "Failed to add step", variant: "destructive" });
      return;
    }
    setItems((prev) => [...prev, data as ChecklistItem]);
  };

  const handleAdd = async () => {
    await addItem(newLabel);
    setNewLabel("");
  };

  const toggle = async (item: ChecklistItem) => {
    const next = !item.completed;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, completed: next } : i))
    );
    const { error } = await supabase
      .from("assignment_checklist_items")
      .update({ completed: next })
      .eq("id", item.id);
    if (error) {
      toast({ title: "Failed to update", variant: "destructive" });
      load();
    }
  };

  const remove = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    const { error } = await supabase
      .from("assignment_checklist_items")
      .delete()
      .eq("id", id);
    if (error) {
      toast({ title: "Failed to delete", variant: "destructive" });
      load();
    }
  };

  const generateAI = async () => {
    if (!user) return;
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "analyze-assignment",
        {
          body: {
            assignment_title: assignmentTitle || "Assignment",
            assignment_description:
              assignmentDescription ||
              "Generate a step-by-step checklist for completing this assignment.",
          },
        }
      );
      if (error) throw error;

      // Try to extract steps from AI response
      const text: string =
        data?.analysis || data?.result || data?.text || JSON.stringify(data);
      const steps = text
        .split(/\n+/)
        .map((line) => line.replace(/^\s*(\d+\.|[-*•])\s*/, "").trim())
        .filter((line) => line.length > 4 && line.length < 200)
        .slice(0, 8);

      if (steps.length === 0) {
        toast({ title: "Could not extract steps from AI response" });
      } else {
        for (const step of steps) await addItem(step);
        toast({ title: `Added ${steps.length} AI-suggested steps` });
      }
    } catch (e) {
      console.error(e);
      toast({ title: "AI generation failed", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const completed = items.filter((i) => i.completed).length;
  const pct = items.length ? Math.round((completed / items.length) * 100) : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <ListChecks className="h-4 w-4 text-primary" />
          Checklist
          {items.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {completed}/{items.length} · {pct}%
            </span>
          )}
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={generateAI}
          disabled={generating}
        >
          {generating ? (
            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
          ) : null}
          AI suggest
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
          {items.length === 0 && (
            <p className="text-xs text-muted-foreground py-2">
              No steps yet. Add one or use AI suggest.
            </p>
          )}
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 rounded-md border border-border/40 bg-background/40 px-2 py-1.5"
            >
              <Checkbox
                checked={item.completed}
                onCheckedChange={() => toggle(item)}
              />
              <span
                className={`flex-1 text-sm ${
                  item.completed
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {item.label}
              </span>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => remove(item.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Add a step..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button type="button" size="icon" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
