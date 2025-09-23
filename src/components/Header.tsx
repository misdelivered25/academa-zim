import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  GraduationCap, 
  MapPin, 
  Database, 
  Menu, 
  X,
  User
} from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-hero rounded-lg p-2">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">ZimUni Hub</h1>
              <p className="text-xs text-muted-foreground">Academic Excellence Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#dashboard" className="text-foreground hover:text-primary transition-colors flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Study Center</span>
            </a>
            <a href="#libraries" className="text-foreground hover:text-primary transition-colors flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Libraries</span>
            </a>
            <a href="#campus" className="text-foreground hover:text-primary transition-colors flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Campus</span>
            </a>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
            <Button size="sm" className="bg-gradient-hero hover:shadow-glow transition-all">
              Get Started
            </Button>
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
              <a href="#dashboard" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors">
                <BookOpen className="h-4 w-4" />
                <span>Study Center</span>
              </a>
              <a href="#libraries" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors">
                <Database className="h-4 w-4" />
                <span>Libraries</span>
              </a>
              <a href="#campus" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors">
                <MapPin className="h-4 w-4" />
                <span>Campus</span>
              </a>
              <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-border">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
                <Button size="sm" className="bg-gradient-hero hover:shadow-glow transition-all">
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;