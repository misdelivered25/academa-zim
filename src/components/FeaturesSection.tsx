import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      color: "primary"
    },
    {
      icon: Calendar,
      title: "Academic Calendar",
      description: "Never miss important dates with synchronized calendars showing exams, assignments, and university events.",
      color: "secondary"
    },
    {
      icon: Database,
      title: "Digital Libraries",
      description: "Seamlessly search through research databases and library catalogs across all participating universities.",
      color: "primary"
    },
    {
      icon: MapPin,
      title: "Campus Navigation",
      description: "Interactive maps with real-time directions to lecture halls, libraries, and campus facilities.",
      color: "secondary"
    },
    {
      icon: Users,
      title: "Study Groups",
      description: "Connect with peers taking similar courses and form collaborative study groups.",
      color: "primary"
    },
    {
      icon: Award,
      title: "Exam Preparation",
      description: "Access past papers, study guides, and practice tests to excel in your examinations.",
      color: "secondary"
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "Find exactly what you need with AI-powered search across all academic resources.",
      color: "primary"
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Get timely reminders for assignments, exams, and important university announcements.",
      color: "secondary"
    },
    {
      icon: Clock,
      title: "Time Management",
      description: "Track your study time and get insights to improve your academic productivity.",
      color: "primary"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Everything You Need for 
            <span className="block bg-gradient-hero bg-clip-text text-transparent">
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
              <Card 
                key={index}
                className="p-6 bg-gradient-card border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  isPrimary ? 'bg-primary/10' : 'bg-secondary/10'
                }`}>
                  <IconComponent className={`h-6 w-6 ${
                    isPrimary ? 'text-primary' : 'text-secondary'
                  } group-hover:scale-110 transition-transform`} />
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-card rounded-2xl p-8 border border-border shadow-elegant max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Transform Your Studies?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of students already using ZimUni Hub to achieve academic excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-hero hover:shadow-glow transition-all">
                Get Started Free
              </Button>
              <Button variant="outline" size="lg" className="hover:bg-accent transition-all">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;