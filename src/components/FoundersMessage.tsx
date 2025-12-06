import { Quote } from "lucide-react";
import CosmicBackground from "@/components/CosmicBackground";

const ZimbabweFlag = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 60 40" className={className} role="img" aria-label="Zimbabwe Flag">
    <rect y="0" width="60" height="5.71" fill="#319208"/>
    <rect y="5.71" width="60" height="5.71" fill="#FFD200"/>
    <rect y="11.42" width="60" height="5.71" fill="#DE2010"/>
    <rect y="17.13" width="60" height="5.71" fill="#000000"/>
    <rect y="22.84" width="60" height="5.71" fill="#DE2010"/>
    <rect y="28.55" width="60" height="5.71" fill="#FFD200"/>
    <rect y="34.26" width="60" height="5.74" fill="#319208"/>
    <polygon points="0,0 20,20 0,40" fill="#FFFFFF"/>
    <polygon points="0,2 17,20 0,38" fill="#000000" fillOpacity="0"/>
    <path d="M0,0 L20,20 L0,40" fill="none" stroke="#000000" strokeWidth="1.5"/>
    <polygon 
      points="10,10 11.5,14 16,14 12.5,17 14,21 10,18 6,21 7.5,17 4,14 8.5,14" 
      fill="#DE2010"
    />
    <g transform="translate(6.5, 11) scale(0.35)" fill="#FFD200">
      <path d="M10,0 C8,2 6,4 6,7 C6,10 8,12 10,14 C9,14 7,13 6,12 C5,14 6,16 8,17 L4,20 L6,20 L10,17 C12,17 14,16 14,14 C14,12 12,10 10,8 C12,8 14,9 15,11 C16,9 15,7 13,6 C14,4 13,2 10,0Z"/>
    </g>
  </svg>
);

const FoundersMessage = () => {
  return (
    <section className="relative section-padding overflow-hidden">
      <CosmicBackground overlayOpacity={65} showShootingStars={false} />

      <div className="relative container-responsive max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <Quote className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Founder's Message
          </h2>
        </div>

        <div className="glass-card rounded-2xl p-8 lg:p-12 space-y-6">
          <div className="flex items-start gap-4">
            <ZimbabweFlag className="w-12 h-8 flex-shrink-0 mt-1 rounded shadow-sm" />
            <p className="text-lg lg:text-xl text-foreground leading-relaxed">
              ZimUni Hub supports His Excellency President Dr Emmerson Mnangagwa's <strong>Vision 2030</strong>.
            </p>
          </div>
          
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Our work aligns with national goals for education, technology, and youth development.
            </p>
            <p>
              We commit to deliver services that build skills, create opportunities, and strengthen innovation across Zimbabwe.
            </p>
            <p>
              We focus on progress through practical solutions and reliable support for students and young professionals.
            </p>
          </div>
          
          <p className="text-foreground font-medium text-lg leading-relaxed">
            We move with the nation toward a modern, prosperous Zimbabwe.
          </p>
          
          <div className="pt-6 border-t border-border/50">
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
