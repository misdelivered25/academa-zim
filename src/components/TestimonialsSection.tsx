import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote, Star } from "lucide-react";

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

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <Quote className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            What Students Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students across Zimbabwe who are already succeeding with ZimUni Hub
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="p-6 bg-card border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-muted-foreground italic">
                  "{testimonial.text}"
                </p>

                {/* Student Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-accent text-foreground font-semibold">
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
        <div className="mt-16 pt-12 border-t border-border">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <div className="text-sm text-muted-foreground">Student Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">15+</div>
              <div className="text-sm text-muted-foreground">Partner Universities</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Platform Access</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
