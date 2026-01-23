import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Award, 
  FileText, 
  Users, 
  Bell,
  TrendingUp,
  Target,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  GraduationCap,
  MapPin,
  Database,
  Loader2,
  Bot,
  Play,
  Search,
  Trash2,
  Sparkles,
  BarChart3,
  PieChart,
  Activity,
  Settings
} from "lucide-react";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StudyAssistant } from "@/components/StudyAssistant";
import { VideoTutorials } from "@/components/VideoTutorials";
import { ScholarSearch } from "@/components/ScholarSearch";
import CourseManagement from "@/components/CourseManagement";
import AssignmentCreation from "@/components/AssignmentCreation";
import CampusMap from "@/components/CampusMap";
import RealtimeDashboard from "@/components/RealtimeDashboard";
import { NotificationManager } from "@/components/NotificationManager";
import CosmicBackground from "@/components/CosmicBackground";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import PreferencesPanel from "@/components/PreferencesPanel";

type Assignment = {
  id: string;
  title: string;
  course_id: string | null;
  due_date: string | null;
  status: string | null;
  user_id: string | null;
  created_at: string | null;
};

type Course = {
  id: string;
  course_name: string;
  user_id: string | null;
  semester: string | null;
  created_at: string | null;
};

type StudySession = {
  id: string;
  user_id: string | null;
  course_id: string | null;
  session_date: string | null;
  hours: number | null;
  created_at: string | null;
};

type Profile = {
  id: string;
  full_name: string;
  student_email: string | null;
  phone_number: string | null;
  avatar_url: string | null;
  created_at: string | null;
};

// Circular Progress Component for better visualization
const CircularProgress = ({ value, size = 80, strokeWidth = 8, color = "primary" }: { value: number; size?: number; strokeWidth?: number; color?: string }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const roundedValue = Math.round(value * 100) / 100; // Round to 2 decimal places
  const offset = circumference - (roundedValue / 100) * circumference;
  
  // Format display value - show integer if whole number, otherwise 1 decimal
  const displayValue = roundedValue % 1 === 0 ? roundedValue.toFixed(0) : roundedValue.toFixed(1);
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-muted/30"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={color === "primary" ? "text-primary" : color === "secondary" ? "text-secondary" : "text-accent"}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-foreground">{displayValue}%</span>
      </div>
    </div>
  );
};

// Mini bar chart for study hours visualization
const MiniBarChart = ({ data }: { data: number[] }) => {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((value, i) => (
        <div
          key={i}
          className="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-t transition-all duration-300 hover:from-secondary hover:to-secondary/50"
          style={{ height: `${(value / max) * 100}%`, minHeight: value > 0 ? '4px' : '0' }}
        />
      ))}
    </div>
  );
};

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [studySessions, setStudySessions] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    course_id: "",
    due_date: "",
    status: "pending"
  });

  // Fetch all data
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const assignmentsRes = await (supabase as any)
        .from('assignments')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });
      
      const coursesRes = await (supabase as any)
        .from('courses')
        .select('*')
        .eq('user_id', user.id);
      
      const studySessionsRes = await (supabase as any)
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('session_date', { ascending: false })
        .limit(10);
      
      const profileRes = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (assignmentsRes.data) setAssignments(assignmentsRes.data);
      if (coursesRes.data) setCourses(coursesRes.data);
      if (studySessionsRes.data) setStudySessions(studySessionsRes.data);
      if (profileRes.data) setProfile(profileRes.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addAssignment = async () => {
    if (!user || !newAssignment.title || !newAssignment.course_id || !newAssignment.due_date) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from('assignments')
        .insert([{
          title: newAssignment.title,
          course_id: newAssignment.course_id,
          due_date: newAssignment.due_date,
          status: newAssignment.status,
          user_id: user.id
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assignment added successfully",
      });

      setNewAssignment({ title: "", course_id: "", due_date: "", status: "pending" });
      setIsAddDialogOpen(false);
      fetchDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add assignment",
        variant: "destructive",
      });
    }
  };

  const toggleAssignmentStatus = async (assignmentId: string, currentStatus: string | null) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    
    try {
      const { error } = await (supabase as any)
        .from('assignments')
        .update({ status: newStatus })
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Assignment marked as ${newStatus}`,
      });

      fetchDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update assignment",
        variant: "destructive",
      });
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

      fetchDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete assignment",
        variant: "destructive",
      });
    }
  };

  // Calculate stats from real data
  const completionRate = assignments.length > 0 
    ? Math.round((assignments.filter(a => a.status === 'completed').length / assignments.length) * 100) 
    : 0;

  const totalStudyHours = studySessions.reduce((total, session) => total + (session.hours || 0), 0);
  
  // Get last 7 days of study hours for mini chart
  const last7DaysHours = Array(7).fill(0).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const daySession = studySessions.find(s => s.session_date?.startsWith(dateStr));
    return daySession?.hours || 0;
  });

  const quickStats = [
    {
      label: "Active Courses",
      value: courses.length.toString(),
      subtitle: "Enrolled",
      icon: BookOpen,
      gradient: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/20",
      iconColor: "text-primary"
    },
    {
      label: "Pending Tasks",
      value: assignments.filter(a => a.status !== 'completed').length.toString(),
      subtitle: "Due soon",
      icon: Calendar,
      gradient: "from-secondary/20 to-secondary/5",
      iconBg: "bg-secondary/20",
      iconColor: "text-secondary"
    },
    {
      label: "Study Hours",
      value: `${totalStudyHours}h`,
      subtitle: "This week",
      icon: Clock,
      gradient: "from-accent/20 to-accent/5",
      iconBg: "bg-accent/20",
      iconColor: "text-accent"
    },
    {
      label: "Completion",
      value: `${completionRate}%`,
      subtitle: "Overall",
      icon: TrendingUp,
      gradient: "from-primary/20 to-secondary/10",
      iconBg: "bg-primary/20",
      iconColor: "text-primary"
    }
  ];

  const recentActivity = studySessions.slice(0, 5).map(session => ({
    type: "study",
    title: `Study session - ${session.hours}h`,
    course: courses.find(c => c.id === session.course_id)?.course_name || "Unknown Course",
    time: new Date(session.session_date).toLocaleDateString(),
    icon: Clock
  }));

  const getPriorityColor = (status: string) => {
    switch (status) {
      case "completed": return "secondary";
      case "pending": return "destructive";
      case "in_progress": return "outline";
      default: return "outline";
    }
  };

  const getDaysUntilDue = (dueDate: string | null) => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const now = new Date();
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative">
        <CosmicBackground showStars={true} showShootingStars={false} overlayOpacity={95} />
        <Header />
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <CosmicBackground showStars={true} showShootingStars={false} overlayOpacity={97} />
      <Header />
      
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'Student'}!
              </h1>
              <span className="text-2xl">👋</span>
            </div>
            <p className="text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Your Academic Dashboard • Ready to excel today?
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={signOut}
            className="glass-card border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all"
          >
            Sign Out
          </Button>
        </div>

        {/* Notification Manager */}
        <div className="mb-6 md:mb-8">
          <NotificationManager />
        </div>

        {/* Quick Stats - Enhanced Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon;
            
            return (
              <Link key={index} to="/study-center">
                <Card className={`glass-card border-border/30 hover:border-primary/50 transition-all duration-300 hover-lift overflow-hidden group`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50 group-hover:opacity-70 transition-opacity`} />
                  <CardContent className="relative p-4 md:p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</p>
                        <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground/80">{stat.subtitle}</p>
                      </div>
                      <div className={`p-2 md:p-3 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform`}>
                        <IconComponent className={`h-5 w-5 md:h-6 md:w-6 ${stat.iconColor}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Tabs for different sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex flex-wrap justify-start gap-1 h-auto p-1 bg-card/50 border border-border/30 rounded-xl w-full md:w-fit">
            <TabsTrigger 
              value="overview" 
              className="flex-1 md:flex-none text-xs sm:text-sm px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg whitespace-nowrap"
            >
              <GraduationCap className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="courses" 
              className="flex-1 md:flex-none text-xs sm:text-sm px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg whitespace-nowrap"
            >
              <BookOpen className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Courses</span>
            </TabsTrigger>
            <TabsTrigger 
              value="realtime" 
              className="flex-1 md:flex-none text-xs sm:text-sm px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg whitespace-nowrap"
            >
              <Activity className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Realtime</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ai-assistant" 
              className="flex-1 md:flex-none text-xs sm:text-sm px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg whitespace-nowrap"
            >
              <Bot className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">AI Assistant</span>
              <span className="sm:hidden">AI</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tutorials" 
              className="flex-1 md:flex-none text-xs sm:text-sm px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg whitespace-nowrap"
            >
              <Play className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Tutorials</span>
            </TabsTrigger>
            <TabsTrigger 
              value="research" 
              className="flex-1 md:flex-none text-xs sm:text-sm px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg whitespace-nowrap"
            >
              <Search className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Research</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex-1 md:flex-none text-xs sm:text-sm px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg whitespace-nowrap"
            >
              <Settings className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="animate-fade-in">
            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
              {/* Left Column - Assignments & Courses */}
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                {/* Upcoming Assignments */}
                <Card className="glass-card border-border/30 overflow-hidden">
                  <CardHeader className="border-b border-border/20 bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/20">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        Upcoming Assignments
                      </CardTitle>
                      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="glass-card border-primary/30 hover:bg-primary/20">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Task
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card border-border/30">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-primary" />
                              Add New Assignment
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="title">Assignment Title</Label>
                              <Input
                                id="title"
                                value={newAssignment.title}
                                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                                placeholder="Enter assignment title"
                                className="bg-background/50"
                              />
                            </div>
                            <div>
                              <Label htmlFor="course">Course</Label>
                              <Select value={newAssignment.course_id} onValueChange={(value) => setNewAssignment({ ...newAssignment, course_id: value })}>
                                <SelectTrigger className="bg-background/50">
                                  <SelectValue placeholder="Select a course" />
                                </SelectTrigger>
                                <SelectContent className="bg-background border border-border z-50">
                                  {courses.length === 0 ? (
                                    <div className="p-2 text-sm text-muted-foreground">
                                      No courses yet. Go to "Courses" tab to add courses first!
                                    </div>
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
                            <div>
                              <Label htmlFor="due_date">Due Date</Label>
                              <Input
                                id="due_date"
                                type="date"
                                value={newAssignment.due_date}
                                onChange={(e) => setNewAssignment({ ...newAssignment, due_date: e.target.value })}
                                className="bg-background/50"
                              />
                            </div>
                            <Button onClick={addAssignment} className="w-full bg-primary hover:bg-primary/90">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Assignment
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 space-y-3">
                    {assignments.length > 0 ? assignments.slice(0, 5).map((assignment, index) => {
                      const course = courses.find(c => c.id === assignment.course_id);
                      const daysUntil = getDaysUntilDue(assignment.due_date);
                      const isUrgent = daysUntil !== null && daysUntil <= 3 && daysUntil >= 0;
                      const isOverdue = daysUntil !== null && daysUntil < 0;
                      
                      return (
                        <div 
                          key={assignment.id} 
                          className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-md ${
                            assignment.status === 'completed' 
                              ? 'bg-primary/5 border-primary/20' 
                              : isOverdue 
                                ? 'bg-destructive/10 border-destructive/30' 
                                : isUrgent 
                                  ? 'bg-secondary/10 border-secondary/30' 
                                  : 'bg-card/50 border-border/30 hover:border-primary/30'
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <button 
                            onClick={() => toggleAssignmentStatus(assignment.id, assignment.status)}
                            className="transition-transform hover:scale-110"
                          >
                            {assignment.status === 'completed' ? (
                              <div className="p-1 rounded-full bg-primary/20">
                                <CheckCircle className="h-5 w-5 text-primary" />
                              </div>
                            ) : (
                              <div className="p-1 rounded-full bg-muted/30 hover:bg-primary/20 transition-colors">
                                <AlertCircle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                              </div>
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-medium truncate ${assignment.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                              {assignment.title}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="truncate">{course?.course_name || 'Unknown Course'}</span>
                              <span>•</span>
                              <span className={isOverdue ? 'text-destructive' : isUrgent ? 'text-secondary' : ''}>
                                {isOverdue ? `${Math.abs(daysUntil!)} days overdue` : daysUntil === 0 ? 'Due today' : daysUntil === 1 ? 'Due tomorrow' : `${daysUntil} days left`}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={getPriorityColor(assignment.status)} 
                              className="hidden sm:flex"
                            >
                              {assignment.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteAssignment(assignment.id)}
                              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="text-center py-12">
                        <div className="p-4 rounded-full bg-muted/20 w-fit mx-auto mb-4">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">No assignments yet. Add one to get started!</p>
                      </div>
                    )}
                    <Link to="/study-center">
                      <Button variant="ghost" className="w-full mt-4 hover:bg-primary/10 group">
                        View All Assignments 
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Current Courses with Enhanced Visualization */}
                <Card className="glass-card border-border/30 overflow-hidden">
                  <CardHeader className="border-b border-border/20 bg-gradient-to-r from-secondary/5 to-transparent">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-secondary/20">
                          <BookOpen className="h-5 w-5 text-secondary" />
                        </div>
                        Current Courses
                      </CardTitle>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setActiveTab("courses")}
                        className="glass-card border-secondary/30 hover:bg-secondary/20"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Course
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6">
                    {courses.length > 0 ? (
                      <div className="grid gap-4">
                        {courses.map((course, index) => {
                          const courseAssignments = assignments.filter(a => a.course_id === course.id);
                          const completedAssignments = courseAssignments.filter(a => a.status === 'completed').length;
                          const progress = courseAssignments.length > 0 ? Math.round((completedAssignments / courseAssignments.length) * 100) : 0;
                          
                          return (
                            <div 
                              key={course.id} 
                              className="p-4 rounded-xl bg-card/50 border border-border/30 hover:border-primary/30 transition-all group"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <div className="flex items-center gap-4">
                                <CircularProgress value={progress} size={60} strokeWidth={6} />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                    {course.course_name}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    Semester: {course.semester || 'Current'}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <FileText className="h-3 w-3" />
                                      {courseAssignments.length} tasks
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <CheckCircle className="h-3 w-3 text-primary" />
                                      {completedAssignments} done
                                    </span>
                                  </div>
                                </div>
                                <Badge variant="secondary" className="hidden sm:flex">
                                  {progress}%
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="p-4 rounded-full bg-muted/20 w-fit mx-auto mb-4">
                          <BookOpen className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">No courses enrolled yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Quick Actions, Activity & Goals */}
              <div className="space-y-6 md:space-y-8">
                {/* Study Hours Chart */}
                <Card className="glass-card border-border/30 overflow-hidden">
                  <CardHeader className="border-b border-border/20 bg-gradient-to-r from-accent/5 to-transparent pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="p-2 rounded-lg bg-accent/20">
                        <BarChart3 className="h-4 w-4 text-accent" />
                      </div>
                      Weekly Study Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <MiniBarChart data={last7DaysHours} />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                        <span key={i}>{day}</span>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/20">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total this week</span>
                        <span className="text-lg font-bold text-foreground">{last7DaysHours.reduce((a, b) => a + b, 0)}h</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="glass-card border-border/30 overflow-hidden">
                  <CardHeader className="border-b border-border/20 pb-4">
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                    <CardDescription className="text-xs">Access your most used features</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 space-y-1">
                    {[
                      { to: "/study-center", icon: BookOpen, label: "Study Center", color: "primary" },
                      { to: "/libraries", icon: Database, label: "Digital Libraries", color: "secondary" },
                      { to: "/campus", icon: MapPin, label: "Campus Maps", color: "accent" },
                    ].map((action, i) => (
                      <Link key={i} to={action.to}>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start hover:bg-primary/10 group rounded-lg"
                        >
                          <div className={`p-1.5 rounded-lg bg-${action.color}/10 mr-3 group-hover:bg-${action.color}/20 transition-colors`}>
                            <action.icon className={`h-4 w-4 text-${action.color}`} />
                          </div>
                          {action.label}
                          <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Button>
                      </Link>
                    ))}
                    <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 group rounded-lg">
                      <div className="p-1.5 rounded-lg bg-primary/10 mr-3 group-hover:bg-primary/20 transition-colors">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      Study Groups
                      <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Button>
                    <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 group rounded-lg">
                      <div className="p-1.5 rounded-lg bg-secondary/10 mr-3 group-hover:bg-secondary/20 transition-colors">
                        <Award className="h-4 w-4 text-secondary" />
                      </div>
                      Exam Prep
                      <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="glass-card border-border/30 overflow-hidden">
                  <CardHeader className="border-b border-border/20 pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <Bell className="h-4 w-4 text-primary" />
                      </div>
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {recentActivity.length > 0 ? recentActivity.map((activity, index) => {
                      const IconComponent = activity.icon;
                      return (
                        <div 
                          key={index} 
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/20 transition-colors"
                        >
                          <div className="p-2 rounded-full bg-primary/10">
                            <IconComponent className="h-3 w-3 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{activity.course} • {activity.time}</p>
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground text-sm">No recent activity.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Academic Goals with Circular Progress */}
                <Card className="glass-card border-border/30 overflow-hidden">
                  <CardHeader className="border-b border-border/20 pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="p-2 rounded-lg bg-secondary/20">
                        <Target className="h-4 w-4 text-secondary" />
                      </div>
                      Academic Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                      <div className="flex flex-col items-center text-center p-2 sm:p-3 rounded-lg bg-accent/30">
                        <CircularProgress 
                          value={courses.length > 0 ? Math.min((courses.length / 6) * 100, 100) : 0} 
                          size={60} 
                          strokeWidth={5}
                          color="primary"
                        />
                        <p className="text-xs text-muted-foreground mt-2 font-medium">Courses</p>
                      </div>
                      <div className="flex flex-col items-center text-center p-2 sm:p-3 rounded-lg bg-accent/30">
                        <CircularProgress 
                          value={studySessions.length > 0 ? Math.min((totalStudyHours / 50) * 100, 100) : 0} 
                          size={60} 
                          strokeWidth={5}
                          color="secondary"
                        />
                        <p className="text-xs text-muted-foreground mt-2 font-medium">Study Hours</p>
                      </div>
                      <div className="flex flex-col items-center text-center p-2 sm:p-3 rounded-lg bg-accent/30">
                        <CircularProgress 
                          value={completionRate} 
                          size={60} 
                          strokeWidth={5}
                          color="primary"
                        />
                        <p className="text-xs text-muted-foreground mt-2 font-medium">Completed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="animate-fade-in">
            <CourseManagement />
          </TabsContent>

          <TabsContent value="realtime" className="animate-fade-in">
            <RealtimeDashboard />
          </TabsContent>

          <TabsContent value="ai-assistant" className="animate-fade-in">
            <StudyAssistant />
          </TabsContent>

          <TabsContent value="tutorials" className="animate-fade-in">
            <VideoTutorials />
          </TabsContent>

          <TabsContent value="research" className="animate-fade-in">
            <ScholarSearch />
          </TabsContent>

          <TabsContent value="settings" className="animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <PreferencesPanel />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
