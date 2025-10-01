import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AssignmentCreation() {
  const [isOpen, setIsOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assignment, setAssignment] = useState({
    title: "",
    course_id: "",
    due_date: "",
    description: "",
    status: "pending",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
    fetchTemplates();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase.from("courses").select("*");
    if (!error) setCourses(data || []);
  };

  const fetchTemplates = async () => {
    const { data, error } = await supabase.from("assignment_templates").select("*");
    if (!error) setTemplates(data || []);
  };

  const analyzeAssignment = async (description: string) => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("study-assistant", {
        body: {
          messages: [{
            role: "user",
            content: `Analyze this assignment and provide difficulty rating (easy/medium/hard) and estimated hours needed. Assignment: ${description}. Respond in JSON format: {"difficulty": "medium", "hours": 5, "tips": "Study tips here"}`
          }]
        }
      });

      if (error) throw error;

      // Parse AI response
      const analysis = JSON.parse(data.response);
      return analysis;
    } catch (error) {
      console.error("AI analysis error:", error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreate = async () => {
    if (!assignment.title || !assignment.course_id) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Please sign in", variant: "destructive" });
      return;
    }

    // Analyze with AI if description provided
    let aiAnalysis = null;
    if (assignment.description) {
      aiAnalysis = await analyzeAssignment(assignment.description);
    }

    const { error } = await supabase.from("assignments").insert({
      ...assignment,
      user_id: user.id,
      difficulty_rating: aiAnalysis?.difficulty,
      estimated_hours: aiAnalysis?.hours,
      ai_analysis: aiAnalysis,
    });

    if (error) {
      toast({ title: "Error creating assignment", variant: "destructive" });
    } else {
      toast({ title: "Assignment created successfully" });
      setAssignment({ title: "", course_id: "", due_date: "", description: "", status: "pending" });
      setIsOpen(false);
    }
  };

  const handleUseTemplate = (template: any) => {
    setAssignment({
      ...assignment,
      title: template.title,
      description: template.description,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Assignment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={assignment.title}
                onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
                placeholder="e.g., Chapter 5 Essay"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Course *</Label>
              <Select value={assignment.course_id} onValueChange={(val) => setAssignment({ ...assignment, course_id: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.course_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={assignment.due_date}
                onChange={(e) => setAssignment({ ...assignment, due_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={assignment.description}
                onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
                placeholder="Describe the assignment requirements..."
                rows={4}
              />
            </div>

            <Button onClick={handleCreate} disabled={isAnalyzing} className="w-full">
              {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isAnalyzing ? "Analyzing with AI..." : "Create Assignment"}
            </Button>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Use Template</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {templates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:bg-accent" onClick={() => handleUseTemplate(template)}>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm flex items-center justify-between">
                      {template.title}
                      <Badge variant={template.difficulty === "hard" ? "destructive" : template.difficulty === "medium" ? "default" : "secondary"}>
                        {template.difficulty}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {template.category} • ~{template.estimated_hours}h
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}