import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  BookOpen, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  FileText, 
  Video, 
  Download,
  Eye,
  Star,
  Users,
  Award,
  CheckCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Upload
} from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const StudyCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { toast } = useToast();
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignmentProgress, setAssignmentProgress] = useState<Record<string, any>>({});
  const [quizAttempts, setQuizAttempts] = useState<Record<string, any[]>>({});
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [uploadingAssignment, setUploadingAssignment] = useState<string | null>(null);

  // Fetch user's assignments and courses
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [assignmentsRes, coursesRes, progressRes, attemptsRes, quizzesRes] = await Promise.all([
        (supabase as any)
          .from('assignments')
          .select('*')
          .eq('user_id', user.id)
          .order('due_date', { ascending: true }),
        (supabase as any)
          .from('courses')
          .select('*')
          .eq('user_id', user.id),
        (supabase as any)
          .from('assignment_progress')
          .select('*')
          .eq('user_id', user.id),
        (supabase as any)
          .from('quiz_attempts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        (supabase as any)
          .from('quizzes')
          .select('*')
          .eq('user_id', user.id)
      ]);

      if (assignmentsRes.data) setAssignments(assignmentsRes.data);
      if (coursesRes.data) setCourses(coursesRes.data);
      if (quizzesRes.data) setQuizzes(quizzesRes.data);
      
      // Map progress by assignment_id
      if (progressRes.data) {
        const progressMap: Record<string, any> = {};
        progressRes.data.forEach((p: any) => {
          progressMap[p.assignment_id] = p;
        });
        setAssignmentProgress(progressMap);
      }

      // Map attempts by quiz_id
      if (attemptsRes.data) {
        const attemptsMap: Record<string, any[]> = {};
        attemptsRes.data.forEach((a: any) => {
          if (!attemptsMap[a.quiz_id]) {
            attemptsMap[a.quiz_id] = [];
          }
          attemptsMap[a.quiz_id].push(a);
        });
        setQuizAttempts(attemptsMap);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load your data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAssignment = async (assignmentId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('assignments')
        .delete()
        .eq('id', assignmentId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assignment deleted successfully",
      });

      fetchUserData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete assignment",
        variant: "destructive",
      });
    }
  };

  // Handler functions for button actions
  const handleViewAssignment = (assignment: any) => {
    const course = courses.find(c => c.id === assignment.course_id);
    toast({
      title: "Opening Assignment",
      description: `Opening ${assignment.title}${course ? ` for ${course.course_name}` : ''}`,
    });
    window.open('https://www.canva.com/design/DAG3jzZvP1o/gwkgpltTj8kBVHWQACiUWA/view?utm_content=DAG3jzZvP1o&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h2a6c4773cb', '_blank');
  };

  const handleStartWork = async (assignment: any) => {
    try {
      // Update progress to in_progress
      const { data, error } = await supabase.functions.invoke('update-assignment-progress', {
        body: {
          assignment_id: assignment.id,
          status: 'in_progress',
          progress_percentage: assignmentProgress[assignment.id]?.progress_percentage || 0,
        }
      });

      if (error) throw error;

      toast({
        title: "Starting Assignment",
        description: `Starting work on ${assignment.title}`,
      });

      // Refresh progress
      fetchUserData();
      
      window.open('https://www.canva.com/design/DAG3jzZvP1o/gwkgpltTj8kBVHWQACiUWA/view?utm_content=DAG3jzZvP1o&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h2a6c4773cb', '_blank');
    } catch (error) {
      console.error('Error starting assignment:', error);
      toast({
        title: "Error",
        description: "Failed to start assignment",
        variant: "destructive",
      });
    }
  };

  const handleViewMaterial = (material: any) => {
    toast({
      title: "Opening Study Material", 
      description: `Opening ${material.title}`,
    });
    window.open('https://www.canva.com/design/DAG3jzZvP1o/gwkgpltTj8kBVHWQACiUWA/view?utm_content=DAG3jzZvP1o&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h2a6c4773cb', '_blank');
  };

  const handleDownloadMaterial = (material: any) => {
    toast({
      title: "Downloading Material",
      description: `Downloading ${material.title}`,
    });
    window.open('https://www.canva.com/design/DAG3jzZvP1o/gwkgpltTj8kBVHWQACiUWA/view?utm_content=DAG3jzZvP1o&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h2a6c4773cb', '_blank');
  };

  const handleStartQuiz = async (quiz: any) => {
    if (!quiz.available) {
      toast({
        title: "Quiz Unavailable",
        description: "This quiz is currently closed",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('start-quiz-attempt', {
        body: { quiz_id: quiz.id }
      });

      if (error) throw error;

      toast({
        title: "Starting Quiz",
        description: `Starting ${quiz.title}. Good luck!`,
      });

      // Refresh attempts
      fetchUserData();
      
      window.open('https://www.canva.com/design/DAG3jzZvP1o/gwkgpltTj8kBVHWQACiUWA/view?utm_content=DAG3jzZvP1o&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h2a6c4773cb', '_blank');
    } catch (error) {
      console.error('Error starting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to start quiz",
        variant: "destructive",
      });
    }
  };

  const handleMarkComplete = async (assignment: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('update-assignment-progress', {
        body: {
          assignment_id: assignment.id,
          status: 'completed',
          progress_percentage: 100,
        }
      });

      if (error) throw error;

      toast({
        title: "Assignment Completed",
        description: `Great job on completing ${assignment.title}!`,
      });

      // Refresh progress
      fetchUserData();
    } catch (error) {
      console.error('Error marking assignment as complete:', error);
      toast({
        title: "Error",
        description: "Failed to mark assignment as complete",
        variant: "destructive",
      });
    }
  };

  const handleSubmitAssignment = async (assignment: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('update-assignment-progress', {
        body: {
          assignment_id: assignment.id,
          status: 'submitted',
          progress_percentage: 100,
        }
      });

      if (error) throw error;

      toast({
        title: "Assignment Submitted",
        description: `${assignment.title} has been submitted successfully!`,
      });

      // Refresh progress
      fetchUserData();
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast({
        title: "Error",
        description: "Failed to submit assignment",
        variant: "destructive",
      });
    }
  };

  const getAssignmentStatusBadge = (assignmentId: string) => {
    const progress = assignmentProgress[assignmentId];
    if (!progress) return <Badge variant="outline">Not Started</Badge>;

    switch (progress.status) {
      case 'in_progress':
        return <Badge className="bg-blue-500">{progress.progress_percentage}% Complete</Badge>;
      case 'submitted':
        return <Badge className="bg-yellow-500">Submitted</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  const getQuizBestScore = (quizId: string) => {
    const attempts = quizAttempts[quizId];
    if (!attempts || attempts.length === 0) return null;

    const completedAttempts = attempts.filter(a => a.status === 'completed');
    if (completedAttempts.length === 0) return null;

    const bestAttempt = completedAttempts.reduce((best, current) => {
      const currentPercentage = current.total_points > 0 
        ? (current.score / current.total_points) * 100 
        : 0;
      const bestPercentage = best.total_points > 0 
        ? (best.score / best.total_points) * 100 
        : 0;
      return currentPercentage > bestPercentage ? current : best;
    });

    const percentage = bestAttempt.total_points > 0 
      ? Math.round((bestAttempt.score / bestAttempt.total_points) * 100) 
      : 0;

    return { percentage, score: bestAttempt.score, totalPoints: bestAttempt.total_points };
  };

  const handleNewAssignment = () => {
    toast({
      title: "Creating Assignment",
      description: "Opening assignment creation form",
    });
  };

  const handleUploadMaterial = () => {
    toast({
      title: "Upload Material",
      description: "Opening file upload dialog",
    });
  };

  const handleCreateQuiz = () => {
    toast({
      title: "Create Quiz",
      description: "Opening quiz creation form",
    });
  };

  const handleUploadAssignment = async (assignmentId: string, file: File) => {
    if (!user) return;

    setUploadingAssignment(assignmentId);
    
    try {
      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${assignmentId}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('assignment-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Read file content for analysis (for text-based files)
      let documentText = '';
      if (file.type.includes('text') || file.name.endsWith('.pdf') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
        // For demo purposes, we'll use a placeholder
        // In production, you'd use a proper document parser
        documentText = `Assignment submission: ${file.name}`;
      }

      // Analyze the assignment using AI
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-assignment', {
        body: { documentText: documentText || `File uploaded: ${file.name}` }
      });

      if (analysisError) {
        console.error('Analysis error:', analysisError);
        // Continue even if analysis fails
      }

      // Update assignment with file path and AI analysis
      const { error: updateError } = await (supabase as any)
        .from('assignments')
        .update({
          file_path: uploadData.path,
          file_name: file.name,
          ai_analysis: analysisData?.analysis || null,
          difficulty_rating: analysisData?.analysis?.difficulty || null,
          estimated_hours: analysisData?.analysis?.hours || null,
        })
        .eq('id', assignmentId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Update progress to in_progress with 25% completion
      await supabase.functions.invoke('update-assignment-progress', {
        body: {
          assignment_id: assignmentId,
          status: 'in_progress',
          progress_percentage: 25,
          notes: 'Assignment document uploaded and analyzed'
        }
      });

      toast({
        title: "Upload Successful",
        description: analysisData?.analysis 
          ? `File analyzed: ${analysisData.analysis.difficulty} difficulty, ~${analysisData.analysis.hours}h estimated`
          : "File uploaded successfully",
      });

      // Refresh data
      fetchUserData();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploadingAssignment(null);
    }
  };

  const triggerFileUpload = (assignmentId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await handleUploadAssignment(assignmentId, file);
      }
    };
    input.click();
  };


  const studyMaterials = [
    {
      title: "Algorithm Analysis Lecture Notes",
      course: "CS301",
      type: "notes",
      format: "PDF",
      pages: 45,
      views: 234,
      rating: 4.8,
      lastUpdated: "2024-01-10"
    },
    {
      title: "Calculus Integration Video Series",
      course: "MATH301",
      type: "video",
      format: "MP4",
      duration: "2h 15m",
      views: 567,
      rating: 4.9,
      lastUpdated: "2024-01-08"
    },
    {
      title: "Chemistry Lab Manual 2024",
      course: "CHEM201",
      type: "manual",
      format: "PDF",
      pages: 120,
      views: 189,
      rating: 4.6,
      lastUpdated: "2024-01-05"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "outline";
      case "in-progress": return "secondary";
      case "pending": return "destructive";
      default: return "outline";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "outline";
      case "medium": return "secondary";
      case "hard": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Study Center</h1>
          <p className="text-muted-foreground">
            Access all your assignments, study materials, and practice quizzes in one place
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assignments, materials, quizzes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Due Date
            </Button>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="assignments" className="space-y-6">
          <TabsList className="grid w-full md:w-fit grid-cols-3">
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="materials">Study Materials</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-foreground">Assignments & Homework</h2>
              <Button 
                className="bg-gradient-hero hover:shadow-glow transition-all"
                onClick={handleNewAssignment}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Assignment
              </Button>
            </div>

            <div className="grid gap-6">
              {loading ? (
                <p className="text-center text-muted-foreground py-8">Loading your assignments...</p>
              ) : assignments.length > 0 ? (
                assignments.map((assignment) => {
                  const course = courses.find(c => c.id === assignment.course_id);
                  const progress = assignmentProgress[assignment.id];
                  return (
                    <Card key={assignment.id} className="bg-gradient-card border-border hover:shadow-card transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="text-lg">{assignment.title}</CardTitle>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline">{course?.course_name || 'No Course'}</Badge>
                              {getAssignmentStatusBadge(assignment.id)}
                              {assignment.difficulty_rating && (
                                <Badge variant={getDifficultyColor(assignment.difficulty_rating)}>{assignment.difficulty_rating}</Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            {assignment.estimated_hours && (
                              <p className="text-sm font-medium text-foreground">{assignment.estimated_hours}h</p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              Due {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No date'}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {assignment.description && (
                          <p className="text-muted-foreground mb-4">{assignment.description}</p>
                        )}
                        {assignment.ai_analysis && (
                          <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                            <p className="text-sm font-medium text-foreground mb-1">AI Analysis</p>
                            <div className="text-xs text-muted-foreground space-y-1">
                              {assignment.ai_analysis.topics && (
                                <p><strong>Topics:</strong> {assignment.ai_analysis.topics.join(', ')}</p>
                              )}
                              {assignment.ai_analysis.tips && (
                                <p><strong>Tips:</strong> {assignment.ai_analysis.tips}</p>
                              )}
                            </div>
                          </div>
                        )}
                        {assignment.file_name && (
                          <div className="mb-4 p-2 bg-muted/50 rounded flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{assignment.file_name}</span>
                          </div>
                        )}
                        <div className="flex gap-2 flex-wrap">
                          <Button 
                            size="sm" 
                            className="bg-gradient-hero hover:shadow-glow transition-all"
                            onClick={() => handleViewAssignment(assignment)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => triggerFileUpload(assignment.id)}
                            disabled={uploadingAssignment === assignment.id}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploadingAssignment === assignment.id ? 'Uploading...' : 'Upload File'}
                          </Button>
                          {(!progress || progress.status !== 'completed') && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStartWork(assignment)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              {progress?.status === 'in_progress' ? 'Continue Work' : 'Start Work'}
                            </Button>
                          )}
                          {progress && progress.status === 'in_progress' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="bg-yellow-500/10 hover:bg-yellow-500/20"
                                onClick={() => handleSubmitAssignment(assignment)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Submit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="bg-green-500/10 hover:bg-green-500/20"
                                onClick={() => handleMarkComplete(assignment)}
                              >
                                <Award className="h-4 w-4 mr-2" />
                                Mark Complete
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAssignment(assignment.id)}
                            className="ml-auto hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <p className="text-center text-muted-foreground py-8">No assignments yet. Create one to get started!</p>
              )}
            </div>
          </TabsContent>

          {/* Study Materials Tab */}
          <TabsContent value="materials" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-foreground">Study Materials</h2>
              <Button 
                className="bg-gradient-hero hover:shadow-glow transition-all"
                onClick={handleUploadMaterial}
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload Material
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyMaterials.map((material, index) => (
                <Card key={index} className="bg-gradient-card border-border hover:shadow-card transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{material.title}</CardTitle>
                        <Badge variant="outline">{material.course}</Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-secondary fill-current" />
                        <span className="text-sm text-muted-foreground">{material.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Format:</span>
                        <span className="font-medium">{material.format}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {material.type === "video" ? "Duration:" : "Pages:"}
                        </span>
                        <span className="font-medium">
                          {material.type === "video" ? material.duration : `${material.pages} pages`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Views:</span>
                        <span className="font-medium">{material.views}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-gradient-hero hover:shadow-glow transition-all"
                          onClick={() => handleViewMaterial(material)}
                        >
                          {material.type === "video" ? (
                            <><Video className="h-4 w-4 mr-2" />Watch</>
                          ) : (
                            <><Eye className="h-4 w-4 mr-2" />View</>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadMaterial(material)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value="quizzes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-foreground">Practice Quizzes</h2>
              <Button 
                className="bg-gradient-hero hover:shadow-glow transition-all"
                onClick={handleCreateQuiz}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Quiz
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {loading ? (
                <p className="text-center text-muted-foreground py-8">Loading quizzes...</p>
              ) : quizzes.length > 0 ? (
                quizzes.map((quiz) => {
                  const bestScore = getQuizBestScore(quiz.id);
                  const attempts = quizAttempts[quiz.id] || [];
                  const course = courses.find(c => c.id === quiz.course_id);
                  
                  return (
                    <Card key={quiz.id} className="bg-gradient-card border-border hover:shadow-card transition-all">
                      <CardHeader>
                        <div className="space-y-2">
                          <CardTitle className="text-lg">{quiz.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{course?.course_name || 'No Course'}</Badge>
                            {bestScore && (
                              <Badge className="bg-green-500">Best: {bestScore.percentage}%</Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {quiz.description && (
                            <p className="text-sm text-muted-foreground">{quiz.description}</p>
                          )}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Questions:</span>
                              <span className="font-medium">{quiz.total_questions || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Duration:</span>
                              <span className="font-medium">{quiz.duration_minutes || 'N/A'} min</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Attempts:</span>
                              <span className="font-medium">{attempts.filter(a => a.status === 'completed').length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Difficulty:</span>
                              <span className="font-medium capitalize">{quiz.difficulty || 'N/A'}</span>
                            </div>
                            {bestScore && (
                              <div className="flex justify-between col-span-2">
                                <span className="text-muted-foreground">Best Score:</span>
                                <span className="font-medium text-green-500">
                                  {bestScore.score}/{bestScore.totalPoints} ({bestScore.percentage}%)
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="pt-2">
                            <Button 
                              className="w-full bg-gradient-hero hover:shadow-glow transition-all"
                              onClick={() => handleStartQuiz(quiz)}
                            >
                              <Award className="h-4 w-4 mr-2" />
                              {attempts.length > 0 ? 'Retake Quiz' : 'Start Quiz'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <p className="text-center text-muted-foreground py-8 col-span-2">No quizzes yet. Create one to get started!</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudyCenter;