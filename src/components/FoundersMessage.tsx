import { Quote } from "lucide-react";

const FoundersMessage = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Cosmic Galaxy Background */}
      <div className="absolute inset-0 bg-[#020817]">
        <div className="absolute inset-0 opacity-70"
          style={{
            background: `
              radial-gradient(ellipse at 15% 20%, rgba(30, 58, 138, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 85% 80%, rgba(29, 78, 216, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.25) 0%, transparent 60%)
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
              radial-gradient(1px 1px at 80% 10%, white, transparent)
            `,
            backgroundSize: '200% 200%',
            backgroundPosition: '50% 50%'
          }}
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-background/60"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <Quote className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Founder's Message
          </h2>
        </div>

        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 lg:p-12 space-y-6">
          <p className="text-lg text-foreground leading-relaxed">
            ZimUni Hub supports His Excellency President Dr Emmerson Mnangagwa's Vision 2030.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our work aligns with national goals for education, technology, and youth development.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We commit to deliver services that build skills, create opportunities, and strengthen innovation across Zimbabwe.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We focus on progress through practical solutions and reliable support for students and young professionals.
          </p>
          <p className="text-foreground font-medium leading-relaxed">
            We move with the nation toward a modern, prosperous Zimbabwe.
          </p>
          
          <div className="pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              — <span className="font-semibold text-foreground">Miguel Hore</span>, Founder
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundersMessage;
