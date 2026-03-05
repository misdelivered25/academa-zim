import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  BookOpen, 
  Database, 
  MapPin, 
  User,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/study-center", icon: BookOpen, label: "Study" },
  { to: "/libraries", icon: Database, label: "Library" },
  { to: "/campus", icon: MapPin, label: "Campus" },
];

export const MobileNav = () => {
  const location = useLocation();
  
  // Hide on auth pages
  const hiddenPaths = ['/login', '/signup', '/reset-password'];
  if (hiddenPaths.includes(location.pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-md border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.to;
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-lg transition-all min-w-0 touch-manipulation",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground active:bg-accent"
              )}
            >
              <IconComponent className={cn(
                "h-5 w-5 mb-1 transition-transform",
                isActive && "scale-110"
              )} />
              <span className={cn(
                "text-[10px] font-medium truncate",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
