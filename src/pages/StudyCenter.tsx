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
  Trash2
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
      const [assignmentsRes, coursesRes] = await Promise.all([
        (supabase as any)
          .from('assignments')
          .select('*')
          .eq('user_id', user.id)
          .order('due_date', { ascending: true }),
        (supabase as any)
          .from('courses')
          .select('*')
          .eq('user_id', user.id)
      ]);

      if (assignmentsRes.data) setAssignments(assignmentsRes.data);
      if (coursesRes.data) setCourses(coursesRes.data);
    } catch (error) {
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

  const handleStartWork = (assignment: any) => {
    toast({
      title: "Starting Assignment",
      description: `Starting work on ${assignment.title}`,
    });
    window.open('https://www.canva.com/design/DAG3jzZvP1o/gwkgpltTj8kBVHWQACiUWA/view?utm_content=DAG3jzZvP1o&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h2a6c4773cb', '_blank');
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

  const handleStartQuiz = (quiz: any) => {
    if (!quiz.available) {
      toast({
        title: "Quiz Unavailable",
        description: "This quiz is currently closed",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Starting Quiz",
      description: `Starting ${quiz.title}`,
    });
    window.open('https://www.canva.com/design/DAG3jzZvP1o/gwkgpltTj8kBVHWQACiUWA/view?utm_content=DAG3jzZvP1o&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h2a6c4773cb', '_blank');
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

  const quizzes = [
    {
      title: "Data Structures Mid-term Quiz",
      course: "CS301",
      questions: 20,
      duration: "45 mins",
      attempts: 2,
      bestScore: 85,
      available: true,
      deadline: "2024-01-22"
    },
    {
      title: "Linear Algebra Quick Assessment",
      course: "MATH201",
      questions: 10,
      duration: "20 mins",
      attempts: 1,
      bestScore: 92,
      available: true,
      deadline: "2024-01-25"
    },
    {
      title: "History Knowledge Check",
      course: "HIST101",
      questions: 15,
      duration: "30 mins",
      attempts: 3,
      bestScore: 78,
      available: false,
      deadline: "2024-01-12"
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
                  return (
                    <Card key={assignment.id} className="bg-gradient-card border-border hover:shadow-card transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="text-lg">{assignment.title}</CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{course?.course_name || 'No Course'}</Badge>
                              <Badge variant={getStatusColor(assignment.status)}>{assignment.status}</Badge>
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
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-gradient-hero hover:shadow-glow transition-all"
                            onClick={() => handleViewAssignment(assignment)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {assignment.status !== "completed" && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStartWork(assignment)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Start Work
                            </Button>
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
              {quizzes.map((quiz, index) => (
                <Card key={index} className="bg-gradient-card border-border hover:shadow-card transition-all">
                  <CardHeader>
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{quiz.course}</Badge>
                        {quiz.available ? (
                          <Badge variant="secondary">Available</Badge>
                        ) : (
                          <Badge variant="destructive">Closed</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Questions:</span>
                          <span className="font-medium">{quiz.questions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-medium">{quiz.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Attempts:</span>
                          <span className="font-medium">{quiz.attempts}/3</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Best Score:</span>
                          <span className="font-medium">{quiz.bestScore}%</span>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <p className="text-sm text-muted-foreground mb-3">
                          Deadline: {quiz.deadline}
                        </p>
                        {quiz.available ? (
                          <Button 
                            className="w-full bg-gradient-hero hover:shadow-glow transition-all"
                            onClick={() => handleStartQuiz(quiz)}
                          >
                            <Award className="h-4 w-4 mr-2" />
                            Start Quiz
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            disabled 
                            className="w-full"
                            onClick={() => handleStartQuiz(quiz)}
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Quiz Closed
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudyCenter;