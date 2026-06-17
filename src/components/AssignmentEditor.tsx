import { useState, useEffect } from "react";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AssignmentChecklist from "@/components/AssignmentChecklist";
import { Separator } from "@/components/ui/separator";

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  course_id: string | null;
  status: string | null;
  difficulty_rating: string | null;
  estimated_hours: number | null;
}

interface Course {
  id: string;
  course_name: string;
}

interface AssignmentEditorProps {
  assignment: Assignment | null;
  courses: Course[];
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function AssignmentEditor({ 
  assignment, 
  courses, 
  isOpen, 
  onClose, 
  onSave 
}: AssignmentEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    course_id: "",
    difficulty_rating: "",
    estimated_hours: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title || "",
        description: assignment.description || "",
        due_date: assignment.due_date ? assignment.due_date.split('T')[0] : "",
        course_id: assignment.course_id || "",
        difficulty_rating: assignment.difficulty_rating || "",
        estimated_hours: assignment.estimated_hours?.toString() || "",
      });
    }
  }, [assignment]);

  const handleSave = async () => {
    if (!assignment || !formData.title) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("assignments")
        .update({
          title: formData.title,
          description: formData.description || null,
          due_date: formData.due_date || null,
          course_id: formData.course_id || null,
          difficulty_rating: formData.difficulty_rating || null,
          estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", assignment.id);

      if (error) throw error;

      toast({ title: "Assignment updated successfully" });
      onSave();
      onClose();
    } catch (error) {
      console.error("Error updating assignment:", error);
      toast({ title: "Error updating assignment", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Assignment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title *</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Assignment title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-course">Course</Label>
            <Select 
              value={formData.course_id} 
              onValueChange={(val) => setFormData({ ...formData, course_id: val })}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                {courses.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">No courses available</div>
                ) : (
                  courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.course_name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-due-date">Due Date</Label>
            <Input
              id="edit-due-date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-difficulty">Difficulty</Label>
              <Select 
                value={formData.difficulty_rating} 
                onValueChange={(val) => setFormData({ ...formData, difficulty_rating: val })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-hours">Est. Hours</Label>
              <Input
                id="edit-hours"
                type="number"
                min="0"
                step="0.5"
                value={formData.estimated_hours}
                onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
                placeholder="e.g., 4"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Assignment description..."
              rows={4}
            />
          </div>

          {assignment && (
            <>
              <Separator />
              <AssignmentChecklist
                assignmentId={assignment.id}
                assignmentTitle={formData.title}
                assignmentDescription={formData.description}
              />
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
