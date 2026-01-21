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
  ArrowRight,
  GraduationCap,
  Building2,
  FlaskConical,
  ExternalLink,
  Microscope,
  BookMarked,
  Landmark
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CosmicBackground from "@/components/CosmicBackground";

interface UniversityInfo {
  name: string;
  shortName: string;
  location: string;
  founded: string;
  website: string;
  description: string;
  stats: {
    icon: React.ElementType;
    title: string;
    subtitle: string;
  }[];
  highlight?: {
    icon: React.ElementType;
    title: string;
    description: string;
  };
}

const universityData: Record<string, UniversityInfo> = {
  "University of Zimbabwe": {
    name: "University of Zimbabwe",
    shortName: "UZ",
    location: "Harare",
    founded: "1952",
    website: "https://www.uz.ac.zw/",
    description: "The oldest and largest university in Zimbabwe. Originally founded as the University College of Rhodesia and Nyasaland.",
    stats: [
      { icon: Building2, title: "11 Faculties", subtitle: "Including Medicine, Law, Engineering" },
      { icon: Users, title: "20,000+", subtitle: "Students enrolled" }
    ],
    highlight: {
      icon: FlaskConical,
      title: "Research Excellence",
      description: "Lake Kariba Research Station & community outreach programs"
    }
  },
  "National University of Science and Technology": {
    name: "National University of Science and Technology",
    shortName: "NUST",
    location: "Bulawayo",
    founded: "1991",
    website: "https://www.nust.ac.zw/",
    description: "Zimbabwe's second largest university, established to focus on science, technology, and engineering education.",
    stats: [
      { icon: Building2, title: "7 Faculties", subtitle: "Science, Engineering, Medicine" },
      { icon: Users, title: "15,000+", subtitle: "Students enrolled" }
    ],
    highlight: {
      icon: Microscope,
      title: "Innovation Hub",
      description: "Leading in technological research and industrial partnerships"
    }
  },
  "Midlands State University": {
    name: "Midlands State University",
    shortName: "MSU",
    location: "Gweru",
    founded: "1999",
    website: "https://www.msu.ac.zw/",
    description: "One of Zimbabwe's fastest-growing universities, known for its diverse academic programs and vibrant campus life.",
    stats: [
      { icon: Building2, title: "9 Faculties", subtitle: "Arts, Commerce, Science, Law" },
      { icon: Users, title: "25,000+", subtitle: "Students enrolled" }
    ],
    highlight: {
      icon: BookMarked,
      title: "Academic Excellence",
      description: "Strong focus on research, innovation, and community engagement"
    }
  },
  "Chinhoyi University of Technology": {
    name: "Chinhoyi University of Technology",
    shortName: "CUT",
    location: "Chinhoyi",
    founded: "2001",
    website: "https://www.cut.ac.zw/",
    description: "A state-owned university focused on technological education and applied sciences.",
    stats: [
      { icon: Building2, title: "6 Schools", subtitle: "Technology, Agriculture, Business" },
      { icon: Users, title: "8,000+", subtitle: "Students enrolled" }
    ],
    highlight: {
      icon: FlaskConical,
      title: "Technology Focus",
      description: "Specializing in applied sciences and technological innovation"
    }
  },
  "Bindura University of Science Education": {
    name: "Bindura University of Science Education",
    shortName: "BUSE",
    location: "Bindura",
    founded: "1996",
    website: "https://www.buse.ac.zw/",
    description: "Specializes in science education and teacher training, producing highly qualified science educators for Zimbabwe.",
    stats: [
      { icon: Building2, title: "4 Faculties", subtitle: "Science, Agriculture, Commerce" },
      { icon: Users, title: "6,000+", subtitle: "Students enrolled" }
    ],
    highlight: {
      icon: GraduationCap,
      title: "Teacher Training",
      description: "Leading institution for science education and pedagogy"
    }
  },
  "Great Zimbabwe University": {
    name: "Great Zimbabwe University",
    shortName: "GZU",
    location: "Masvingo",
    founded: "1999",
    website: "https://www.gzu.ac.zw/",
    description: "Named after the historic Great Zimbabwe monument, offering diverse programs with a focus on heritage and culture.",
    stats: [
      { icon: Building2, title: "7 Faculties", subtitle: "Education, Arts, Commerce, Law" },
      { icon: Users, title: "12,000+", subtitle: "Students enrolled" }
    ],
    highlight: {
      icon: Landmark,
      title: "Cultural Heritage",
      description: "Strong emphasis on Zimbabwean culture and heritage studies"
    }
  }
};

const UniversityTooltipCard = ({ uni }: { uni: UniversityInfo }) => {
  const HighlightIcon = uni.highlight?.icon || FlaskConical;
  
  return (
    <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-base text-foreground">{uni.name}</h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{uni.location}</span>
              <span className="text-border">•</span>
              <span>Est. {uni.founded}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {uni.description}
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {uni.stats.map((stat, idx) => {
            const StatIcon = stat.icon;
            return (
              <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-accent/50">
                <StatIcon className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-foreground">{stat.title}</p>
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {uni.highlight && (
          <div className="flex items-start gap-2 p-2 rounded-lg bg-accent/50">
            <HighlightIcon className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <p className="text-xs font-medium text-foreground">{uni.highlight.title}</p>
              <p className="text-xs text-muted-foreground">{uni.highlight.description}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-4 py-2 bg-accent/30 border-t border-border/50">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Click to visit official website</span>
          <ExternalLink className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

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
              {universities.map((uniName, index) => {
                const uniInfo = universityData[uniName];
                
                if (uniInfo) {
                  return (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <a 
                          href={uniInfo.website}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full cursor-pointer hover:from-primary/30 hover:to-secondary/30 hover:text-foreground transition-all text-xs sm:text-sm border border-primary/20 hover:border-primary/40 flex items-center gap-2 hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] hover:scale-105 hover:animate-pulse"
                        >
                          <GraduationCap className="h-3.5 w-3.5 transition-transform hover:rotate-12" />
                          {uniName}
                        </a>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-md p-0 overflow-hidden" side="top">
                        <UniversityTooltipCard uni={uniInfo} />
                      </TooltipContent>
                    </Tooltip>
                  );
                }
                
                return (
                  <div key={index} className="px-4 py-2 bg-accent/50 rounded-full text-xs sm:text-sm hover:bg-accent/70 transition-colors">
                    {uniName}
                  </div>
                );
              })}
            </div>
          </TooltipProvider>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
