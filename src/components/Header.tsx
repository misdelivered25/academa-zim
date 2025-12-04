import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { 
  BookOpen, 
  MapPin, 
  Database, 
  Menu, 
  X,
  User,
  Mail,
  Moon,
  Sun,
  Shield,
  Info
} from "lucide-react";
import logo from "@/assets/logo.webp";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} alt="ZimUni Hub Logo" className="h-12 w-12 object-contain" />
            <div>
              <h1 className="text-xl font-bold text-foreground">ZimUni Hub</h1>
              <p className="text-xs text-muted-foreground">Academic Excellence Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
              <Link to="/study-center" className="text-foreground hover:text-primary transition-colors flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Study Center</span>
              </Link>
              <Link to="/libraries" className="text-foreground hover:text-primary transition-colors flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>Libraries</span>
              </Link>
              <Link to="/campus" className="text-foreground hover:text-primary transition-colors flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Campus</span>
              </Link>
              <Link to="/contact" className="text-foreground hover:text-primary transition-colors flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Contact</span>
              </Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors flex items-center space-x-2">
                <Info className="h-4 w-4" />
                <span>About</span>
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-foreground hover:text-primary transition-colors flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Link to="/login">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm" className="bg-gradient-hero hover:shadow-glow transition-all">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-3">
              <Link to="/study-center" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors">
                <BookOpen className="h-4 w-4" />
                <span>Study Center</span>
              </Link>
              <Link to="/libraries" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors">
                <Database className="h-4 w-4" />
                <span>Libraries</span>
              </Link>
              <Link to="/campus" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors">
                <MapPin className="h-4 w-4" />
                <span>Campus</span>
              </Link>
              <Link to="/contact" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors">
                <Mail className="h-4 w-4" />
                <span>Contact</span>
              </Link>
              <Link to="/about" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors">
                <Info className="h-4 w-4" />
                <span>About</span>
              </Link>
              {isAdmin && (
                <Link to="/admin" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors">
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              )}
              <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-border">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="sm" className="bg-gradient-hero hover:shadow-glow transition-all">
                  Get Started
                </Button>
              </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;