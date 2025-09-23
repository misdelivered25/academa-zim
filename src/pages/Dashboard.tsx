import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
  Database
} from "lucide-react";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [selectedSemester, setSelectedSemester] = useState("2024-1");

  const upcomingAssignments = [
    {
      title: "Data Structures Assignment 3",
      course: "CS301",
      dueDate: "2024-01-15",
      priority: "high",
      completed: false
    },
    {
      title: "Linear Algebra Quiz",
      course: "MATH201",
      dueDate: "2024-01-18",
      priority: "medium",
      completed: false
    },
    {
      title: "History Essay",
      course: "HIST101",
      dueDate: "2024-01-20",
      priority: "low",
      completed: true
    }
  ];

  const currentCourses = [
    {
      code: "CS301",
      name: "Data Structures & Algorithms",
      progress: 75,
      nextClass: "Today, 2:00 PM",
      instructor: "Dr. Mukamuri"
    },
    {
      code: "MATH201",
      name: "Linear Algebra",
      progress: 60,
      nextClass: "Tomorrow, 10:00 AM",
      instructor: "Prof. Chigondo"
    },
    {
      code: "ENG102",
      name: "Technical Writing",
      progress: 85,
      nextClass: "Wednesday, 11:00 AM",
      instructor: "Dr. Mutasa"
    },
    {
      code: "HIST101",
      name: "African History",
      progress: 90,
      nextClass: "Thursday, 9:00 AM",
      instructor: "Prof. Ranger"
    }
  ];

  const recentActivity = [
    {
      type: "assignment",
      title: "Submitted Data Mining Project",
      course: "CS401",
      time: "2 hours ago",
      icon: FileText
    },
    {
      type: "quiz",
      title: "Completed Calculus Quiz",
      course: "MATH301",
      time: "1 day ago",
      icon: Award
    },
    {
      type: "study",
      title: "Joined Algorithm Study Group",
      course: "CS301",
      time: "2 days ago",
      icon: Users
    }
  ];

  const quickStats = [
    {
      label: "Courses",
      value: "6",
      change: "+1",
      icon: BookOpen,
      color: "primary"
    },
    {
      label: "Assignments Due",
      value: "3",
      change: "-2",
      icon: Calendar,
      color: "secondary"
    },
    {
      label: "Study Hours",
      value: "42h",
      change: "+5h",
      icon: Clock,
      color: "primary"
    },
    {
      label: "GPA",
      value: "3.8",
      change: "+0.2",
      icon: TrendingUp,
      color: "secondary"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, Sarah! 👋
          </h1>
          <p className="text-muted-foreground">
            University of Zimbabwe • Computer Science • Semester 1, 2024
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon;
            const isPrimary = stat.color === "primary";
            
            return (
              <Card key={index} className="bg-gradient-card border-border hover:shadow-card transition-all">
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
            );
          })}
        </div>

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
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAssignments.map((assignment, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-accent/20 rounded-lg">
                    <div className="flex items-center space-x-3 flex-1">
                      {assignment.completed ? (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <h4 className="font-medium text-foreground">{assignment.title}</h4>
                        <p className="text-sm text-muted-foreground">{assignment.course} • Due {assignment.dueDate}</p>
                      </div>
                    </div>
                    <Badge variant={getPriorityColor(assignment.priority)}>
                      {assignment.priority}
                    </Badge>
                  </div>
                ))}
                <Button variant="ghost" className="w-full mt-4">
                  View All Assignments <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
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
                {currentCourses.map((course, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{course.code} - {course.name}</h4>
                        <p className="text-sm text-muted-foreground">{course.instructor}</p>
                      </div>
                      <Badge variant="secondary">{course.progress}% Complete</Badge>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <p className="text-sm text-muted-foreground">Next class: {course.nextClass}</p>
                    {index < currentCourses.length - 1 && <Separator />}
                  </div>
                ))}
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
                {recentActivity.map((activity, index) => {
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
                })}
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
                    <span>Semester GPA Goal</span>
                    <span>3.8 / 4.0</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Study Hours This Week</span>
                    <span>42 / 50</span>
                  </div>
                  <Progress value={84} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Assignments Completed</span>
                    <span>8 / 10</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;