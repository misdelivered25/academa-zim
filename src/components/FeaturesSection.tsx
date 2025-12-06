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
  Clock,
  ArrowRight
} from "lucide-react";
import CosmicBackground from "@/components/CosmicBackground";

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
    <section className="relative section-padding overflow-hidden" id="features">
      <CosmicBackground overlayOpacity={65} />
      
      <div className="relative container-responsive">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Everything You Need for 
            <span className="block gradient-text mt-2">
              Academic Success
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our comprehensive platform brings together all the tools and resources 
            you need to excel in your university studies across Zimbabwe.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const isPrimary = feature.color === "primary";
            
            return (
              <Link 
                key={index}
                to={feature.path}
                className="block group"
              >
                <Card className="p-6 glass-card hover-lift h-full">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                    isPrimary ? 'bg-primary/10' : 'bg-secondary/10'
                  }`}>
                    <IconComponent className={`h-6 w-6 ${
                      isPrimary ? 'text-primary' : 'text-secondary'
                    }`} />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
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
          <div className="glass-card rounded-2xl p-8 lg:p-10 shadow-elegant max-w-2xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Ready to Transform Your Studies?
            </h3>
            <p className="text-muted-foreground mb-8">
              Join thousands of students already using ZimUni Hub to achieve academic excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-hero btn-glow font-semibold group">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold">
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
