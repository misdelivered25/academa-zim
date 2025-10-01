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
  const filteredCatalog = selectedUniversity
    ? universityCourses.filter(c => c.university_name === selectedUniversity)
    : universityCourses;

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
                <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by university" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Universities</SelectItem>
                    {universities.map((uni) => (
                      <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredCatalog.map((course) => (
                    <Card key={course.id} className="cursor-pointer hover:bg-accent" onClick={() => handleAddFromCatalog(course)}>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">{course.course_code} - {course.course_name}</CardTitle>
                        <CardDescription className="text-xs">
                          {course.university_name} • {course.faculty} • {course.level}
                        </CardDescription>
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