import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  User,
  Phone,
  Calendar,
  BookOpen,
  University
} from "lucide-react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");

  const universities = [
    "University of Zimbabwe",
    "National University of Science and Technology",
    "Midlands State University",
    "Chinhoyi University of Technology",
    "Bindura University of Science Education",
    "Great Zimbabwe University",
    "Zimbabwe Open University",
    "Women's University in Africa"
  ];

  const programs = [
    "Computer Science",
    "Engineering",
    "Medicine",
    "Law",
    "Business Administration",
    "Education",
    "Agriculture",
    "Social Sciences",
    "Natural Sciences",
    "Arts and Humanities"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="w-full max-w-lg relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 mb-6 group">
            <div className="bg-gradient-hero rounded-lg p-2 group-hover:shadow-glow transition-all">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-foreground">ZimUni Hub</h1>
              <p className="text-sm text-muted-foreground">Academic Excellence Platform</p>
            </div>
          </Link>
        </div>

        {/* Signup Card */}
        <Card className="bg-gradient-card border-border shadow-elegant">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Join thousands of students already using ZimUni Hub to excel in their studies
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form className="space-y-4">
              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* University Selection */}
              <div className="space-y-2">
                <Label htmlFor="university" className="text-sm font-medium flex items-center">
                  <University className="h-4 w-4 mr-2" />
                  University
                </Label>
                <select 
                  id="university"
                  value={selectedUniversity}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select your university</option>
                  {universities.map((uni) => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>
              </div>

              {/* Program of Study */}
              <div className="space-y-2">
                <Label htmlFor="program" className="text-sm font-medium flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Program of Study
                </Label>
                <select 
                  id="program"
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select your program</option>
                  {programs.map((program) => (
                    <option key={program} value={program}>{program}</option>
                  ))}
                </select>
              </div>

              {/* Student ID */}
              <div className="space-y-2">
                <Label htmlFor="studentId" className="text-sm font-medium flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Student ID
                </Label>
                <Input
                  id="studentId"
                  type="text"
                  placeholder="e.g., H123456"
                  className="transition-all focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Student Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@university.ac.zw"
                  className="transition-all focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+263 77 123 4567"
                  className="transition-all focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-2">
                <Checkbox id="terms" className="mt-1" />
                <Label
                  htmlFor="terms"
                  className="text-sm leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:text-primary-glow underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:text-primary-glow underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              {/* Create Account Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-hero hover:shadow-glow transition-all"
                size="lg"
              >
                Create Account
              </Button>
            </form>

            <Separator />

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="font-medium text-primary hover:text-primary-glow transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;