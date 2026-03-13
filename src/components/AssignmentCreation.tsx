import { useState, useEffect } from "react";
import { Plus, Loader2, Upload, FileText, Eye } from "lucide-react";
import { z } from "zod";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

const assignmentSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be under 200 characters"),
  course_id: z.string().uuid("Invalid course"),
  due_date: z.string().optional(),
  description: z.string().max(5000, "Description must be under 5000 characters").optional(),
  status: z.string().default("pending"),
});

export default function AssignmentCreation() {
  const [isOpen, setIsOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [documentText, setDocumentText] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (20MB max)
    if (file.size > 20 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 20MB", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    setUploadedFile(file);

    try {
      // For text files, read directly
      if (file.type.includes('text') || file.name.endsWith('.txt')) {
        const text = await file.text();
        setDocumentText(text);
        toast({ title: "File loaded successfully" });
      } else {
        // For other document types, we'll upload and then parse
        toast({ title: "File uploaded", description: "Click 'Analyze Document' to process" });
      }
    } catch (error) {
      console.error("File read error:", error);
      toast({ title: "Error reading file", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const analyzeDocument = async () => {
    if (!uploadedFile && !documentText) {
      toast({ title: "No document to analyze", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    try {
      let textToAnalyze = documentText;

      // If we have a file but no extracted text, we need to extract it first
      if (uploadedFile && !documentText) {
        if (uploadedFile.type === 'application/pdf' || uploadedFile.name.endsWith('.docx') || uploadedFile.name.endsWith('.doc')) {
          // For PDFs and Word docs, we'd need backend parsing
          toast({ 
            title: "Advanced document parsing", 
            description: "PDF and Word documents will be analyzed based on filename and description. Please add details in the description field.",
          });
          textToAnalyze = `Filename: ${uploadedFile.name}\nSize: ${(uploadedFile.size / 1024).toFixed(2)} KB`;
        }
      }

      const { data, error } = await supabase.functions.invoke("analyze-assignment", {
        body: { documentText: textToAnalyze || assignment.description }
      });

      if (error) throw error;

      setAiAnalysis(data.analysis);
      toast({ title: "Document analyzed successfully" });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({ title: "Error analyzing document", variant: "destructive" });
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

    let uploadedFilePath = null;
    let uploadedFileName = null;

    // Upload file if present
    if (uploadedFile) {
      const fileExt = uploadedFile.name.split('.').pop();
      const storagePath = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('assignment-files')
        .upload(storagePath, uploadedFile);

      if (uploadError) {
        toast({ title: "Error uploading file", variant: "destructive" });
        return;
      }

      uploadedFilePath = storagePath;
      uploadedFileName = uploadedFile.name;
    }

    const { error } = await supabase.from("assignments").insert({
      ...assignment,
      user_id: user.id,
      difficulty_rating: aiAnalysis?.difficulty,
      estimated_hours: aiAnalysis?.hours,
      ai_analysis: aiAnalysis,
      file_path: uploadedFilePath,
      file_name: uploadedFileName,
    });

    if (error) {
      toast({ title: "Error creating assignment", variant: "destructive" });
    } else {
      toast({ title: "Assignment created successfully" });
      setAssignment({ title: "", course_id: "", due_date: "", description: "", status: "pending" });
      setUploadedFile(null);
      setDocumentText("");
      setAiAnalysis(null);
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
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {courses.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">No courses available. Create one first!</div>
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

            <div className="space-y-2">
              <Label htmlFor="file">Upload Assignment Document (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt"
                  disabled={isUploading}
                  className="flex-1"
                />
                {uploadedFile && (
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={analyzeDocument}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                  </Button>
                )}
              </div>
              {uploadedFile && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Upload className="h-3 w-3" />
                  {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>

            {documentText && (
              <Alert>
                <Eye className="h-4 w-4" />
                <AlertDescription>
                  <details className="cursor-pointer">
                    <summary className="font-semibold">View extracted text</summary>
                    <div className="mt-2 max-h-40 overflow-y-auto text-xs whitespace-pre-wrap">
                      {documentText.slice(0, 500)}...
                    </div>
                  </details>
                </AlertDescription>
              </Alert>
            )}

            {aiAnalysis && (
              <Alert className="border-primary">
                <AlertDescription className="space-y-2">
                  <div className="font-semibold">AI Analysis Results:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Difficulty:</span>
                      <Badge className="ml-2" variant={aiAnalysis.difficulty === "hard" ? "destructive" : aiAnalysis.difficulty === "medium" ? "default" : "secondary"}>
                        {aiAnalysis.difficulty}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Est. Hours:</span> {aiAnalysis.hours}h
                    </div>
                  </div>
                  {aiAnalysis.topics && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Topics:</span> {aiAnalysis.topics.join(", ")}
                    </div>
                  )}
                  {aiAnalysis.tips && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Tips:</span> {aiAnalysis.tips}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={handleCreate} disabled={isAnalyzing || isUploading} className="w-full">
              {(isAnalyzing || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Assignment
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