import { useState, useEffect } from "react";
import { Plus, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CourseManagement() {
  const [courses, setCourses] = useState<any[]>([]);
  const [universityCourses, setUniversityCourses] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ course_name: "", semester: "" });
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
    fetchUniversityCourses();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error fetching courses", variant: "destructive" });
    } else {
      setCourses(data || []);
    }
  };

  const fetchUniversityCourses = async () => {
    const { data, error } = await supabase
      .from("zim_university_courses")
      .select("*")
      .order("university_name", { ascending: true });

    if (error) {
      toast({ title: "Error fetching university courses", variant: "destructive" });
    } else {
      setUniversityCourses(data || []);
    }
  };

  const handleAddCourse = async () => {
    if (!newCourse.course_name.trim()) {
      toast({ title: "Please enter a course name", variant: "destructive" });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Please sign in to add courses", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("courses").insert({
      course_name: newCourse.course_name,
      semester: newCourse.semester || "Current Semester",
      user_id: user.id,
    });

    if (error) {
      toast({ title: "Error adding course", variant: "destructive" });
    } else {
      toast({ title: "Course added successfully" });
      setNewCourse({ course_name: "", semester: "" });
      setIsOpen(false);
      fetchCourses();
    }
  };

  const handleAddFromCatalog = async (catalogCourse: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Please sign in to add courses", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("courses").insert({
      course_name: `${catalogCourse.course_code} - ${catalogCourse.course_name}`,
      semester: "Current Semester",
      user_id: user.id,
    });

    if (error) {
      toast({ title: "Error adding course", variant: "destructive" });
    } else {
      toast({ title: "Course added from catalog" });
      fetchCourses();
    }
  };

  const handleDeleteCourse = async (id: string) => {
    const { error } = await supabase.from("courses").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting course", variant: "destructive" });
    } else {
      toast({ title: "Course deleted" });
      fetchCourses();
    }
  };

  const universities = [...new Set(universityCourses.map(c => c.university_name))];
  const faculties = [...new Set(universityCourses.map(c => c.faculty).filter(Boolean))];
  const levels = [...new Set(universityCourses.map(c => c.level).filter(Boolean))];
  
  const filteredCatalog = universityCourses.filter(c => {
    if (selectedUniversity && selectedUniversity !== "all" && c.university_name !== selectedUniversity) return false;
    if (selectedFaculty && selectedFaculty !== "all" && c.faculty !== selectedFaculty) return false;
    if (selectedLevel && selectedLevel !== "all" && c.level !== selectedLevel) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Courses</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Create Custom Course</h3>
                <div className="space-y-2">
                  <Label htmlFor="course_name">Course Name</Label>
                  <Input
                    id="course_name"
                    value={newCourse.course_name}
                    onChange={(e) => setNewCourse({ ...newCourse, course_name: e.target.value })}
                    placeholder="e.g., Mathematics 101"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    id="semester"
                    value={newCourse.semester}
                    onChange={(e) => setNewCourse({ ...newCourse, semester: e.target.value })}
                    placeholder="e.g., Spring 2025"
                  />
                </div>
                <Button onClick={handleAddCourse} className="w-full">Add Course</Button>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h3 className="font-semibold">Add from Zimbabwe Universities Catalog</h3>
                
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>University</Label>
                    <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Universities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Universities</SelectItem>
                        {universities.map((uni) => (
                          <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Faculty</Label>
                    <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Faculties" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Faculties</SelectItem>
                        {faculties.map((faculty) => (
                          <SelectItem key={faculty} value={faculty}>{faculty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Level</Label>
                    <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        {levels.map((level) => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  Showing {filteredCatalog.length} course{filteredCatalog.length !== 1 ? 's' : ''}
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {filteredCatalog.map((course) => (
                    <Card key={course.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => handleAddFromCatalog(course)}>
                      <CardHeader className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-base leading-tight">{course.course_name}</CardTitle>
                            <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded shrink-0">
                              {course.course_code}
                            </span>
                          </div>
                          <CardDescription className="text-xs space-y-1">
                            <div className="flex flex-wrap gap-2">
                              <span className="bg-muted px-2 py-0.5 rounded">{course.university_name}</span>
                              {course.faculty && <span className="bg-muted px-2 py-0.5 rounded">{course.faculty}</span>}
                              {course.level && <span className="bg-muted px-2 py-0.5 rounded">{course.level}</span>}
                            </div>
                            {course.description && (
                              <p className="mt-2 text-muted-foreground line-clamp-2">{course.description}</p>
                            )}
                          </CardDescription>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {course.course_name}
                  </CardTitle>
                  <CardDescription>{course.semester}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteCourse(course.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}