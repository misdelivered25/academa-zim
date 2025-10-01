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
  Search
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

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [studySessions, setStudySessions] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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

  // Calculate stats from real data
  const quickStats = [
    {
      label: "Courses",
      value: courses.length.toString(),
      change: "+0",
      icon: BookOpen,
      color: "primary"
    },
    {
      label: "Assignments Due",
      value: assignments.filter(a => a.status !== 'completed').length.toString(),
      change: "0",
      icon: Calendar,
      color: "secondary"
    },
    {
      label: "Study Hours",
      value: `${studySessions.reduce((total, session) => total + (session.hours || 0), 0)}h`,
      change: "+0h",
      icon: Clock,
      color: "primary"
    },
    {
      label: "Completion Rate",
      value: assignments.length > 0 ? `${Math.round((assignments.filter(a => a.status === 'completed').length / assignments.length) * 100)}%` : "0%",
      change: "+0%",
      icon: TrendingUp,
      color: "secondary"
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'Student'}! 👋
            </h1>
            <p className="text-muted-foreground">
              Your Academic Dashboard • Ready to excel today?
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={signOut}
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            Sign Out
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon;
            const isPrimary = stat.color === "primary";
            
            // Define navigation for each stat
            const getNavigationPath = (label: string) => {
              switch (label) {
                case "Courses":
                  return "/study-center";
                case "Assignments Due":
                  return "/study-center";
                case "Study Hours":
                  return "/study-center";
                case "Completion Rate":
                  return "/study-center";
                default:
                  return "/study-center";
              }
            };
            
            return (
              <Link key={index} to={getNavigationPath(stat.label)}>
                <Card className="bg-gradient-card border-border hover:shadow-card transition-all cursor-pointer hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className={`text-xs ${
                          stat.change.startsWith('+') ? 'text-primary' : 'text-secondary'
                        }`}>
                          {stat.change} this week
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg ${
                        isPrimary ? 'bg-primary/10' : 'bg-secondary/10'
                      }`}>
                        <IconComponent className={`h-6 w-6 ${
                          isPrimary ? 'text-primary' : 'text-secondary'
                        }`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <GraduationCap className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="ai-assistant">
              <Bot className="h-4 w-4 mr-2" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="tutorials">
              <Play className="h-4 w-4 mr-2" />
              Tutorials
            </TabsTrigger>
            <TabsTrigger value="research">
              <Search className="h-4 w-4 mr-2" />
              Research
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Assignments & Courses */}
              <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Assignments */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Upcoming Assignments
                  </CardTitle>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Assignment</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Assignment Title</Label>
                          <Input
                            id="title"
                            value={newAssignment.title}
                            onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                            placeholder="Enter assignment title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="course">Course</Label>
                          <Select value={newAssignment.course_id} onValueChange={(value) => setNewAssignment({ ...newAssignment, course_id: value })}>
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
                        <div>
                          <Label htmlFor="due_date">Due Date</Label>
                          <Input
                            id="due_date"
                            type="date"
                            value={newAssignment.due_date}
                            onChange={(e) => setNewAssignment({ ...newAssignment, due_date: e.target.value })}
                          />
                        </div>
                        <Button onClick={addAssignment} className="w-full">
                          Add Assignment
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignments.length > 0 ? assignments.slice(0, 5).map((assignment) => {
                  const course = courses.find(c => c.id === assignment.course_id);
                  return (
                    <div key={assignment.id} className="flex items-center space-x-4 p-4 bg-accent/20 rounded-lg">
                      <div className="flex items-center space-x-3 flex-1">
                        <button onClick={() => toggleAssignmentStatus(assignment.id, assignment.status)}>
                          {assignment.status === 'completed' ? (
                            <CheckCircle className="h-5 w-5 text-primary cursor-pointer" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-muted-foreground cursor-pointer" />
                          )}
                        </button>
                        <div>
                          <h4 className="font-medium text-foreground">{assignment.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {course?.course_name || 'Unknown Course'} • Due {new Date(assignment.due_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getPriorityColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </div>
                  );
                }) : (
                  <p className="text-muted-foreground text-center py-8">No assignments yet. Add one to get started!</p>
                )}
                <Link to="/study-center">
                  <Button variant="ghost" className="w-full mt-4">
                    View All Assignments <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Current Courses */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Current Courses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {courses.length > 0 ? courses.map((course, index) => {
                  const courseAssignments = assignments.filter(a => a.course_id === course.id);
                  const completedAssignments = courseAssignments.filter(a => a.status === 'completed').length;
                  const progress = courseAssignments.length > 0 ? Math.round((completedAssignments / courseAssignments.length) * 100) : 0;
                  
                  return (
                    <div key={course.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">{course.course_name}</h4>
                          <p className="text-sm text-muted-foreground">Semester: {course.semester || 'Current'}</p>
                        </div>
                        <Badge variant="secondary">{progress}% Complete</Badge>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        {courseAssignments.length} assignment{courseAssignments.length !== 1 ? 's' : ''} • {completedAssignments} completed
                      </p>
                      {index < courses.length - 1 && <Separator />}
                    </div>
                  );
                }) : (
                  <p className="text-muted-foreground text-center py-8">No courses enrolled yet.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Activity */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Access your most used features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/study-center">
                  <Button variant="ghost" className="w-full justify-start hover:bg-accent">
                    <BookOpen className="h-4 w-4 mr-3" />
                    Study Center
                  </Button>
                </Link>
                <Link to="/libraries">
                  <Button variant="ghost" className="w-full justify-start hover:bg-accent">
                    <Database className="h-4 w-4 mr-3" />
                    Digital Libraries
                  </Button>
                </Link>
                <Link to="/campus">
                  <Button variant="ghost" className="w-full justify-start hover:bg-accent">
                    <MapPin className="h-4 w-4 mr-3" />
                    Campus Maps
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start hover:bg-accent">
                  <Users className="h-4 w-4 mr-3" />
                  Study Groups
                </Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-accent">
                  <Award className="h-4 w-4 mr-3" />
                  Exam Prep
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.length > 0 ? recentActivity.map((activity, index) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-primary/10 rounded-full p-2">
                        <IconComponent className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.course} • {activity.time}</p>
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-muted-foreground text-center py-8">No recent activity.</p>
                )}
              </CardContent>
            </Card>

            {/* Academic Goals */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Academic Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Courses</span>
                    <span>{courses.length}</span>
                  </div>
                  <Progress value={courses.length > 0 ? Math.min((courses.length / 6) * 100, 100) : 0} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Study Hours Total</span>
                    <span>{studySessions.reduce((total, session) => total + (session.hours || 0), 0)}h</span>
                  </div>
                  <Progress value={studySessions.length > 0 ? Math.min((studySessions.reduce((total, session) => total + (session.hours || 0), 0) / 50) * 100, 100) : 0} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Assignments Completed</span>
                    <span>{assignments.filter(a => a.status === 'completed').length} / {assignments.length}</span>
                  </div>
                  <Progress value={assignments.length > 0 ? (assignments.filter(a => a.status === 'completed').length / assignments.length) * 100 : 0} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
          </TabsContent>

          <TabsContent value="ai-assistant">
            <StudyAssistant />
          </TabsContent>

          <TabsContent value="tutorials">
            <VideoTutorials />
          </TabsContent>

          <TabsContent value="research">
            <ScholarSearch />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;