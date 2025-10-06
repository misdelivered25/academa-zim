import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Clock, BookOpen, CheckCircle2, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Course {
  id: string;
  course_name: string;
  semester: string | null;
  created_at: string;
  user_id: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  course_id: string | null;
  user_id: string;
  status: string;
  created_at: string;
}

interface AssignmentForm {
  title: string;
  description: string;
  due_date: string;
  course_id: string;
}

export default function RealtimeDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [now, setNow] = useState(new Date());
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const realtimeRefs = useRef<{ channels: any[] }>({ channels: [] });
  const [form, setForm] = useState<AssignmentForm>({
    title: "",
    description: "",
    due_date: "",
    course_id: "",
  });

  // Live clock (updates every second)
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Fetch initial data when user is available
  useEffect(() => {
    if (!user) return;

    loadUserData(user.id);
    subscribeRealtime(user.id);

    return () => {
      cleanupRealtime();
    };
  }, [user]);

  // Load initial data
  async function loadUserData(userId: string) {
    const [{ data: c }, { data: a }] = await Promise.all([
      supabase
        .from("courses")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true }),
      supabase
        .from("assignments")
        .select("*")
        .eq("user_id", userId)
        .order("due_date", { ascending: true }),
    ]);
    setCourses(c ?? []);
    setAssignments(a ?? []);
  }

  // Realtime subscriptions
  function subscribeRealtime(userId: string) {
    cleanupRealtime();

    // Courses subscription
    const coursesChannel = supabase
      .channel(`public:courses:user=${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "courses",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          handleRealtimeCourse(payload);
        }
      )
      .subscribe();

    // Assignments subscription
    const assignmentsChannel = supabase
      .channel(`public:assignments:user=${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "assignments",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          handleRealtimeAssignment(payload);
        }
      )
      .subscribe();

    realtimeRefs.current.channels = [coursesChannel, assignmentsChannel];
  }

  function cleanupRealtime() {
    const channels = realtimeRefs.current.channels || [];
    channels.forEach((ch) => {
      try {
        ch.unsubscribe();
      } catch (e) {
        console.error("Error unsubscribing:", e);
      }
    });
    realtimeRefs.current.channels = [];
  }

  // Realtime handlers
  function handleRealtimeCourse(payload: any) {
    const { eventType, new: newRow, old: oldRow } = payload;
    if (eventType === "INSERT") {
      setCourses((prev) => [newRow, ...prev]);
      toast({ title: "New course added!", description: newRow.course_name });
    } else if (eventType === "UPDATE") {
      setCourses((prev) => prev.map((c) => (c.id === newRow.id ? newRow : c)));
    } else if (eventType === "DELETE") {
      setCourses((prev) => prev.filter((c) => c.id !== oldRow.id));
    }
  }

  function handleRealtimeAssignment(payload: any) {
    const { eventType, new: newRow, old: oldRow } = payload;
    if (eventType === "INSERT") {
      setAssignments((prev) => [newRow, ...prev].sort(byDue));
      toast({ title: "New assignment added!", description: newRow.title });
    } else if (eventType === "UPDATE") {
      setAssignments((prev) =>
        prev.map((a) => (a.id === newRow.id ? newRow : a)).sort(byDue)
      );
    } else if (eventType === "DELETE") {
      setAssignments((prev) => prev.filter((a) => a.id !== oldRow.id));
    }
  }

  const byDue = (x: Assignment, y: Assignment) => {
    if (!x?.due_date) return 1;
    if (!y?.due_date) return -1;
    return new Date(x.due_date).getTime() - new Date(y.due_date).getTime();
  };

  // CRUD functions
  async function createAssignment(formData: AssignmentForm) {
    if (!user) return;
    const { error } = await supabase.from("assignments").insert([
      {
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        due_date: formData.due_date || null,
        course_id: formData.course_id || null,
      },
    ]);
    if (error) {
      console.error("createAssignment error", error);
      toast({
        title: "Error",
        description: "Failed to create assignment",
        variant: "destructive",
      });
    }
  }

  async function markComplete(assignmentId: string) {
    const { error } = await supabase
      .from("assignments")
      .update({ status: "completed" })
      .eq("id", assignmentId);
    if (error) {
      console.error("markComplete error", error);
      toast({
        title: "Error",
        description: "Failed to mark assignment as complete",
        variant: "destructive",
      });
    } else {
      toast({ title: "Assignment completed!" });
    }
  }

  async function deleteAssignment(assignmentId: string) {
    const { error } = await supabase
      .from("assignments")
      .delete()
      .eq("id", assignmentId);
    if (error) {
      console.error("deleteAssignment error", error);
      toast({
        title: "Error",
        description: "Failed to delete assignment",
        variant: "destructive",
      });
    } else {
      toast({ title: "Assignment deleted" });
    }
  }

  // UI Helpers: time until due in human readable form
  function timeUntil(dueDate: string | null) {
    if (!dueDate) return "No due date";
    const diff = new Date(dueDate).getTime() - now.getTime();
    if (diff <= 0) return "Overdue";
    const sec = Math.floor(diff / 1000);
    const days = Math.floor(sec / 86400);
    const hours = Math.floor((sec % 86400) / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Please sign in to view your dashboard</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Realtime Dashboard</span>
            <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
              <Clock className="h-4 w-4" />
              {now.toLocaleTimeString()}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Welcome, {user.email}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {now.toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Courses ({courses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No courses yet</p>
          ) : (
            <ul className="space-y-2">
              {courses.map((c) => (
                <li key={c.id} className="flex items-center justify-between p-2 bg-secondary/20 rounded">
                  <span className="font-medium">{c.course_name}</span>
                  {c.semester && (
                    <span className="text-sm text-muted-foreground">
                      {c.semester}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assignments ({assignments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {assignments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No assignments yet</p>
          ) : (
            <ul className="space-y-4">
              {assignments.map((a) => (
                <li key={a.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{a.title}</h4>
                      {a.description && (
                        <p className="text-sm text-muted-foreground">
                          {a.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          Due:{" "}
                          {a.due_date
                            ? format(new Date(a.due_date), "PPp")
                            : "—"}
                        </span>
                        <span>Status: {a.status}</span>
                      </div>
                      <div className="text-sm font-medium text-primary">
                        Time left: {timeUntil(a.due_date)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {a.status !== "completed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markComplete(a.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteAssignment(a.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <Textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div>
              <Input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              />
            </div>
            <div>
              <Select
                value={form.course_id}
                onValueChange={(value) =>
                  setForm({ ...form, course_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.course_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => {
                createAssignment(form);
                setForm({
                  title: "",
                  description: "",
                  due_date: "",
                  course_id: "",
                });
              }}
              disabled={!form.title}
            >
              Create Assignment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
