import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { useUserPreferences } from "@/hooks/useUserPreferences";
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
  Info,
  Download,
  Monitor
} from "lucide-react";
import logo from "@/assets/logo.webp";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAdmin } = useAdmin();
  const location = useLocation();
  const { preferences, savePreferences, isLoaded } = useUserPreferences();

  // Derive effective theme (accounting for system preference)
  const getEffectiveTheme = () => {
    if (preferences.theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return preferences.theme;
  };

  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (isLoaded) {
      setEffectiveTheme(getEffectiveTheme());
    }
  }, [preferences.theme, isLoaded]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const cycleTheme = () => {
    const themeOrder: ("light" | "dark" | "system")[] = ["light", "dark", "system"];
    const currentIndex = themeOrder.indexOf(preferences.theme);
    const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
    savePreferences({ theme: nextTheme });
  };

  const getThemeIcon = () => {
    switch (preferences.theme) {
      case "light": return <Sun className="h-5 w-5" />;
      case "dark": return <Moon className="h-5 w-5" />;
      case "system": return <Monitor className="h-5 w-5" />;
    }
  };

  const navLinks = [
    { to: "/study-center", icon: BookOpen, label: "Study Center" },
    { to: "/libraries", icon: Database, label: "Libraries" },
    { to: "/campus", icon: MapPin, label: "Campus" },
    { to: "/contact", icon: Mail, label: "Contact" },
    { to: "/about", icon: Info, label: "About" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm" 
          : "bg-background/80 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src={logo} 
              alt="ZimUni Hub Logo" 
              className="h-10 w-10 lg:h-12 lg:w-12 object-contain transition-transform group-hover:scale-105" 
            />
            <div className="hidden sm:block">
              <h1 className="text-lg lg:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                ZimUni Hub
              </h1>
              <p className="text-xs text-muted-foreground">Academic Excellence</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                    isActive(link.to)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:text-primary hover:bg-accent"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            {isAdmin && (
              <Link 
                to="/admin" 
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                  isActive("/admin")
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground hover:text-primary hover:bg-accent"
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={cycleTheme}
              className="hover:bg-accent"
              title={`Theme: ${preferences.theme}`}
            >
              {getThemeIcon()}
            </Button>
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-medium">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm" className="bg-gradient-hero btn-glow font-semibold">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={cycleTheme}
              className="hover:bg-accent"
              title={`Theme: ${preferences.theme}`}
            >
              {getThemeIcon()}
            </Button>
            <button
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="py-4 border-t border-border space-y-1">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(link.to)
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-accent"
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            {isAdmin && (
              <Link 
                to="/admin" 
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive("/admin")
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-accent"
                }`}
              >
                <Shield className="h-5 w-5" />
                <span>Admin</span>
              </Link>
            )}
            <div className="flex flex-col space-y-2 px-4 pt-4 mt-2 border-t border-border">
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full justify-center font-medium">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link to="/dashboard" className="w-full">
                <Button className="w-full justify-center bg-gradient-hero font-semibold">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
