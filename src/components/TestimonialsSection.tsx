import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote, Star } from "lucide-react";
import CosmicBackground from "@/components/CosmicBackground";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Tatenda Moyo",
      university: "University of Zimbabwe",
      course: "Computer Science",
      rating: 5,
      text: "ZimUni Hub has completely transformed how I manage my coursework. Having all my assignments, resources, and campus maps in one place saves me hours every week!",
      initials: "TM"
    },
    {
      name: "Rutendo Chikara",
      university: "NUST",
      course: "Electrical Engineering",
      rating: 5,
      text: "The research library access is incredible. I can now access journals and papers from multiple universities without visiting each campus library. Game changer!",
      initials: "RC"
    },
    {
      name: "Tinashe Ncube",
      university: "Chinhoyi University of Technology",
      course: "Civil Engineering",
      rating: 5,
      text: "The assignment tracker keeps me organized and on top of all deadlines. The campus navigation feature is also super helpful for finding lecture halls!",
      initials: "TN"
    },
    {
      name: "Chipo Mutasa",
      university: "Midlands State University",
      course: "Marketing",
      rating: 5,
      text: "As a first-year student, this platform made my transition to university so much easier. Everything I need is right here - from course materials to exam prep resources.",
      initials: "CM"
    }
  ];

  const stats = [
    { value: "98%", label: "Student Satisfaction" },
    { value: "15+", label: "Partner Universities" },
    { value: "50K+", label: "Active Students" },
    { value: "24/7", label: "Platform Access" }
  ];

  return (
    <section className="relative section-padding overflow-hidden">
      <CosmicBackground overlayOpacity={65} />
      
      <div className="relative container-responsive">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <Quote className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            What Students Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students across Zimbabwe who are already succeeding with ZimUni Hub
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="p-6 lg:p-8 glass-card hover-lift"
            >
              <div className="space-y-4">
                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-muted-foreground italic leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Student Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                    <AvatarFallback className="bg-gradient-accent text-secondary-foreground font-semibold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.course} • {testimonial.university}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 pt-12 border-t border-border/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl lg:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
