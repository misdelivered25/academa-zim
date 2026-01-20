import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Users, 
  MapPin, 
  Database, 
  Calendar,
  Award,
  ArrowRight
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CosmicBackground from "@/components/CosmicBackground";

const HeroSection = () => {
  const universities = [
    "University of Zimbabwe",
    "National University of Science and Technology", 
    "Midlands State University",
    "Chinhoyi University of Technology",
    "Bindura University of Science Education",
    "Great Zimbabwe University"
  ];

  const featureCards = [
    {
      icon: Calendar,
      title: "Assignment Tracker",
      description: "Never miss a deadline with our integrated assignment and exam calendar",
      path: "/study-center",
      colorClass: "bg-primary/10 text-primary"
    },
    {
      icon: Database,
      title: "Research Libraries",
      description: "Access digital libraries and databases from all participating universities",
      path: "/libraries",
      colorClass: "bg-secondary/10 text-secondary"
    },
    {
      icon: MapPin,
      title: "Campus Navigation",
      description: "Interactive maps and directions for all university campuses",
      path: "/campus",
      colorClass: "bg-primary/10 text-primary"
    },
    {
      icon: Award,
      title: "Exam Preparation",
      description: "Study guides, past papers, and collaborative study groups",
      path: "/study-center",
      colorClass: "bg-secondary/10 text-secondary"
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <CosmicBackground overlayOpacity={40} />
      
      {/* Content */}
      <div className="relative container-responsive py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center lg:justify-start">
                <div className="bg-gradient-accent rounded-full px-4 py-1.5 shadow-sm">
                  <span className="text-sm font-semibold text-secondary-foreground">All Zimbabwe Universities</span>
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight tracking-tight">
                Your Academic
                <span className="block gradient-text mt-2">
                  Success Hub
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
                Founded by <strong className="text-foreground">Miguel Hore</strong>, connecting every university database in Zimbabwe. Access assignments, exam prep, 
                research libraries, and academic resources.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/dashboard">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-hero btn-glow text-base font-semibold group">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base font-semibold border-border/50 hover:bg-accent transition-all">
                  <Users className="mr-2 h-5 w-5" />
                  Join Community
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 border-t border-border/50">
              {[
                { value: "15+", label: "Universities" },
                { value: "50K+", label: "Students" },
                { value: "1M+", label: "Resources" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="space-y-4 lg:space-y-5">
            {featureCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <Link key={index} to={card.path} className="block">
                  <Card className="p-5 lg:p-6 glass-card hover-lift group">
                    <div className="flex items-start space-x-4">
                      <div className={`rounded-xl p-3 ${card.colorClass} transition-transform group-hover:scale-110`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* University Logos Scroll */}
        <div className="mt-16 lg:mt-20 pt-8 border-t border-border/50">
          <p className="text-center text-muted-foreground text-sm mb-8">
            Connecting students across Zimbabwe's leading universities
          </p>
          <TooltipProvider>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-sm text-muted-foreground">
              {universities.map((uni, index) => (
                uni === "University of Zimbabwe" ? (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <a 
                        href="https://www.uz.ac.zw/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-accent/70 rounded-full cursor-pointer hover:bg-accent hover:text-foreground transition-all text-xs sm:text-sm"
                      >
                        {uni}
                      </a>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-lg p-4" side="top">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-base">University of Zimbabwe</h4>
                          <p className="text-xs text-muted-foreground">Harare • Founded 1952</p>
                        </div>
                        <p className="text-sm">Founded as the University College of Rhodesia and Nyasaland, later becoming University of Rhodesia and then University of Zimbabwe after independence in 1980. It is the oldest and largest university in Zimbabwe.</p>
                        <div>
                          <h5 className="font-medium text-sm mb-1">Academic Structure</h5>
                          <p className="text-xs">11 Faculties: Agriculture; Arts & Humanities; Business & Economics; Computer Engineering & Informatics; Education; Engineering & Built Environment; Law; Medicine & Health Sciences; Science; Social & Behavioural Sciences; Veterinary Science.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-1">Student Population</h5>
                          <p className="text-xs">20,000+ students with undergraduate, postgraduate degrees, diplomas, and research opportunities including the Lake Kariba Research Station.</p>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ) : uni === "Chinhoyi University of Technology" ? (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <a 
                        href="https://www.cut.ac.zw" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-accent/70 rounded-full cursor-pointer hover:bg-accent hover:text-foreground transition-all text-xs sm:text-sm"
                      >
                        {uni}
                      </a>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md p-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">Historical Background</h4>
                        <p className="text-sm">Chinhoyi University of Technology (CUT) was established in 2001 as a state-owned university focused on technological education and applied sciences.</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <div key={index} className="px-4 py-2 bg-accent/50 rounded-full text-xs sm:text-sm hover:bg-accent/70 transition-colors">
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
