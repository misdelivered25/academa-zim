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
  ArrowRight,
  University
} from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState("");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
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

        {/* Login Card */}
        <Card className="bg-gradient-card border-border shadow-elegant">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Sign in to access your academic resources and continue your studies
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form className="space-y-4">
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
                    placeholder="Enter your password"
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </Label>
                </div>
                <Button variant="link" className="px-0 font-normal text-primary hover:text-primary-glow">
                  Forgot password?
                </Button>
              </div>

              {/* Sign In Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-hero hover:shadow-glow transition-all"
                size="lg"
              >
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <Separator />

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="font-medium text-primary hover:text-primary-glow transition-colors"
                >
                  Create your student account
                </Link>
              </p>
            </div>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Need help? Contact your university's IT support or{" "}
                <Link to="/contact" className="text-primary hover:text-primary-glow">
                  our support team
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our{" "}
          <Link to="/terms" className="text-primary hover:text-primary-glow">Terms of Service</Link>
          {" "}and{" "}
          <Link to="/privacy" className="text-primary hover:text-primary-glow">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;