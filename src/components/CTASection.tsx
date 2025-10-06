import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";

const CTASection = () => {
  const benefits = [
    "Access to all university resources",
    "Unlimited assignment tracking",
    "Interactive campus maps",
    "24/7 study assistance",
    "Collaborative study groups",
    "Exam preparation tools"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-hero rounded-3xl p-12 lg:p-16 shadow-glow">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Transform Your Academic Journey?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Join thousands of students who are already excelling with ZimUni Hub. 
              Get instant access to all features - no credit card required.
            </p>

            {/* Benefits List */}
            <div className="grid md:grid-cols-2 gap-4 mb-10 text-left max-w-2xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                  <span className="text-primary-foreground/90">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button 
                  size="lg" 
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg hover:shadow-xl transition-all group"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  Contact Us
                </Button>
              </Link>
            </div>

            <p className="text-sm text-primary-foreground/70 mt-6">
              Free forever. No hidden fees. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
