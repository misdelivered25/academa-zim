import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Users, 
  MapPin, 
  Database, 
  Calendar,
  Award,
  Search,
  Bell,
  Clock
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Unified Study Center",
      description: "Access assignments, quizzes, and study materials from all your courses in one centralized dashboard.",
      color: "primary",
      path: "/study-center"
    },
    {
      icon: Calendar,
      title: "Academic Calendar",
      description: "Never miss important dates with synchronized calendars showing exams, assignments, and university events.",
      color: "secondary",
      path: "/dashboard"
    },
    {
      icon: Database,
      title: "Digital Libraries",
      description: "Seamlessly search through research databases and library catalogs across all participating universities.",
      color: "primary",
      path: "/libraries"
    },
    {
      icon: MapPin,
      title: "Campus Navigation",
      description: "Interactive maps with real-time directions to lecture halls, libraries, and campus facilities.",
      color: "secondary",
      path: "/campus"
    },
    {
      icon: Users,
      title: "Study Groups",
      description: "Connect with peers taking similar courses and form collaborative study groups.",
      color: "primary",
      path: "/study-center"
    },
    {
      icon: Award,
      title: "Exam Preparation",
      description: "Access past papers, study guides, and practice tests to excel in your examinations.",
      color: "secondary",
      path: "/study-center"
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "Find exactly what you need with AI-powered search across all academic resources.",
      color: "primary",
      path: "/libraries"
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Get timely reminders for assignments, exams, and important university announcements.",
      color: "secondary",
      path: "/dashboard"
    },
    {
      icon: Clock,
      title: "Time Management",
      description: "Track your study time and get insights to improve your academic productivity.",
      color: "primary",
      path: "/study-center"
    }
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Cosmic Galaxy Background */}
      <div className="absolute inset-0 bg-[#020817]">
        <div className="absolute inset-0 opacity-70"
          style={{
            background: `
              radial-gradient(ellipse at 15% 20%, rgba(30, 58, 138, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 85% 80%, rgba(29, 78, 216, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.25) 0%, transparent 60%),
              radial-gradient(ellipse at 70% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 45%),
              radial-gradient(circle at 30% 70%, rgba(30, 64, 175, 0.25) 0%, transparent 40%),
              radial-gradient(ellipse at 90% 10%, rgba(37, 99, 235, 0.25) 0%, transparent 50%),
              radial-gradient(circle at 20% 90%, rgba(29, 78, 216, 0.3) 0%, transparent 45%)
            `
          }}
        />
        {/* Stars effect */}
        <div className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `
              radial-gradient(2px 2px at 20% 30%, white, transparent),
              radial-gradient(2px 2px at 60% 70%, white, transparent),
              radial-gradient(1px 1px at 50% 50%, white, transparent),
              radial-gradient(1px 1px at 80% 10%, white, transparent),
              radial-gradient(2px 2px at 90% 60%, white, transparent),
              radial-gradient(1px 1px at 33% 85%, white, transparent),
              radial-gradient(1px 1px at 15% 55%, white, transparent)
            `,
            backgroundSize: '200% 200%',
            backgroundPosition: '50% 50%'
          }}
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-background/60"></div>
        
        {/* Shooting stars */}
        <div className="absolute top-[15%] left-[15%] w-1 h-1 bg-white rounded-full animate-shooting-star" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
        <div className="absolute top-[40%] left-[60%] w-1 h-1 bg-white rounded-full animate-shooting-star" style={{ animationDelay: '1.5s', animationDuration: '4s' }}></div>
        <div className="absolute top-[70%] left-[30%] w-1 h-1 bg-white rounded-full animate-shooting-star" style={{ animationDelay: '2.5s', animationDuration: '3s' }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 text-shadow-lg">
            Everything You Need for 
            <span className="block bg-gradient-hero bg-clip-text text-transparent text-shadow-md">
              Academic Success
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive platform brings together all the tools and resources 
            you need to excel in your university studies across Zimbabwe.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const isPrimary = feature.color === "primary";
            
            return (
              <Link 
                key={index}
                to={feature.path}
                className="block"
              >
                <Card 
                  className="p-6 bg-gradient-card border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 group cursor-pointer h-full"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    isPrimary ? 'bg-primary/10' : 'bg-secondary/10'
                  }`}>
                    <IconComponent className={`h-6 w-6 ${
                      isPrimary ? 'text-primary' : 'text-secondary'
                    } group-hover:scale-110 transition-transform`} />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-2 text-shadow-sm">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-card rounded-2xl p-8 border border-border shadow-elegant max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4 text-shadow-md">
              Ready to Transform Your Studies?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of students already using ZimUni Hub to achieve academic excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-hero hover:shadow-glow transition-all">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="hover:bg-accent transition-all">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;