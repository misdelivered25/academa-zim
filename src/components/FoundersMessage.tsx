import { Quote } from "lucide-react";

const ZimbabweFlag = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 60 40" className={className} role="img" aria-label="Zimbabwe Flag">
    {/* Green stripe */}
    <rect y="0" width="60" height="5.71" fill="#319208"/>
    {/* Yellow stripe */}
    <rect y="5.71" width="60" height="5.71" fill="#FFD200"/>
    {/* Red stripe */}
    <rect y="11.42" width="60" height="5.71" fill="#DE2010"/>
    {/* Black stripe */}
    <rect y="17.13" width="60" height="5.71" fill="#000000"/>
    {/* Red stripe */}
    <rect y="22.84" width="60" height="5.71" fill="#DE2010"/>
    {/* Yellow stripe */}
    <rect y="28.55" width="60" height="5.71" fill="#FFD200"/>
    {/* Green stripe */}
    <rect y="34.26" width="60" height="5.74" fill="#319208"/>
    {/* White triangle */}
    <polygon points="0,0 20,20 0,40" fill="#FFFFFF"/>
    {/* Black triangle border */}
    <polygon points="0,2 17,20 0,38" fill="#000000" fillOpacity="0"/>
    <path d="M0,0 L20,20 L0,40" fill="none" stroke="#000000" strokeWidth="1.5"/>
    {/* Red star */}
    <polygon 
      points="10,10 11.5,14 16,14 12.5,17 14,21 10,18 6,21 7.5,17 4,14 8.5,14" 
      fill="#DE2010"
    />
    {/* Zimbabwe Bird (simplified) */}
    <g transform="translate(6.5, 11) scale(0.35)" fill="#FFD200">
      <path d="M10,0 C8,2 6,4 6,7 C6,10 8,12 10,14 C9,14 7,13 6,12 C5,14 6,16 8,17 L4,20 L6,20 L10,17 C12,17 14,16 14,14 C14,12 12,10 10,8 C12,8 14,9 15,11 C16,9 15,7 13,6 C14,4 13,2 10,0Z"/>
    </g>
  </svg>
);

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
          <div className="flex items-start gap-3">
            <ZimbabweFlag className="w-10 h-7 flex-shrink-0 mt-1 rounded shadow-sm" />
            <p className="text-lg text-foreground leading-relaxed">
              ZimUni Hub supports His Excellency President Dr Emmerson Mnangagwa's <strong>Vision 2030</strong>.
            </p>
          </div>
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
