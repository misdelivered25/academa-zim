import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Users, 
  MapPin, 
  Database, 
  Calendar,
  Award
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import heroImage from "@/assets/hero-education.webp";

const HeroSection = () => {
  const universities = [
    "University of Zimbabwe",
    "National University of Science and Technology", 
    "Midlands State University",
    "Chinhoyi University of Technology",
    "Bindura University of Science Education",
    "Great Zimbabwe University"
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Cosmic Galaxy Background */}
      <div className="absolute inset-0 bg-[#0a0e27]">
        <div className="absolute inset-0 opacity-80"
          style={{
            background: `
              radial-gradient(ellipse at 15% 20%, rgba(138, 43, 226, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 85% 80%, rgba(75, 0, 130, 0.5) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(25, 25, 112, 0.3) 0%, transparent 60%),
              radial-gradient(ellipse at 70% 30%, rgba(147, 51, 234, 0.4) 0%, transparent 45%),
              radial-gradient(circle at 30% 70%, rgba(219, 39, 119, 0.3) 0%, transparent 40%),
              radial-gradient(ellipse at 90% 10%, rgba(59, 130, 246, 0.35) 0%, transparent 50%),
              radial-gradient(circle at 20% 90%, rgba(168, 85, 247, 0.4) 0%, transparent 45%)
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
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50"></div>
      </div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-accent rounded-full px-3 py-1">
                  <span className="text-sm font-semibold text-secondary-foreground">All Zimbabwe Universities</span>
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Your Academic
                <span className="block bg-gradient-hero bg-clip-text text-transparent">
                  Success Hub
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl">
                Founded by <strong className="text-foreground">Miguel Hore</strong>, connecting every university database in Zimbabwe. Access assignments, exam prep, 
                research libraries, campus maps, and academic resources - all in one platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="bg-gradient-hero hover:shadow-glow transition-all">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Start Learning
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" size="lg" className="hover:bg-accent transition-all">
                  <Users className="mr-2 h-5 w-5" />
                  Join Community
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">15+</div>
                <div className="text-sm text-muted-foreground">Universities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1M+</div>
                <div className="text-sm text-muted-foreground">Resources</div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="space-y-6">
            <Link to="/study-center" className="block">
              <Card className="p-6 bg-gradient-card border-border hover:shadow-elegant transition-all duration-300 cursor-pointer hover:-translate-y-1">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Assignment Tracker</h3>
                    <p className="text-muted-foreground text-sm">
                      Never miss a deadline with our integrated assignment and exam calendar
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link to="/libraries" className="block">
              <Card className="p-6 bg-gradient-card border-border hover:shadow-elegant transition-all duration-300 cursor-pointer hover:-translate-y-1">
                <div className="flex items-start space-x-4">
                  <div className="bg-secondary/10 rounded-lg p-3">
                    <Database className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Research Libraries</h3>
                    <p className="text-muted-foreground text-sm">
                      Access digital libraries and databases from all participating universities
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link to="/campus" className="block">
              <Card className="p-6 bg-gradient-card border-border hover:shadow-elegant transition-all duration-300 cursor-pointer hover:-translate-y-1">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Campus Navigation</h3>
                    <p className="text-muted-foreground text-sm">
                      Interactive maps and directions for all university campuses
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link to="/study-center" className="block">
              <Card className="p-6 bg-gradient-card border-border hover:shadow-elegant transition-all duration-300 cursor-pointer hover:-translate-y-1">
                <div className="flex items-start space-x-4">
                  <div className="bg-secondary/10 rounded-lg p-3">
                    <Award className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Exam Preparation</h3>
                    <p className="text-muted-foreground text-sm">
                      Study guides, past papers, and collaborative study groups
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* University Logos Scroll */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-center text-muted-foreground text-sm mb-8">
            Connecting students across Zimbabwe's leading universities
          </p>
          <TooltipProvider>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              {universities.map((uni, index) => (
                uni === "Chinhoyi University of Technology" ? (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <a 
                        href="https://www.cut.ac.zw" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-accent/50 rounded-full cursor-pointer hover:bg-accent transition-colors inline-block"
                      >
                        {uni}
                      </a>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md p-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">Historical Background</h4>
                        <p className="text-sm">Chinhoyi University of Technology (CUT) was established in 2001 as a state-owned university focused on technological education and applied sciences. Located in Chinhoyi, Mashonaland West Province, the university has grown to become one of Zimbabwe's leading institutions for technology-oriented education.</p>
                        <h4 className="font-semibold mt-3">Vision and Mission</h4>
                        <p className="text-sm"><strong>Vision:</strong> To be a premier technological university producing innovative graduates for sustainable development.</p>
                        <p className="text-sm"><strong>Mission:</strong> To provide high-quality technological education, research, and community engagement through applied learning and innovation.</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <div key={index} className="px-4 py-2 bg-accent/50 rounded-full">
                    {uni}
                  </div>
                )
              ))}
            </div>
          </TooltipProvider>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;