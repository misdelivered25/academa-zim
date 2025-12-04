import { Button } from "@/components/ui/button";
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import hgcLogo from "@/assets/hgc-logo.png";
import tatendaLogo from "@/assets/tatenda-foundation-logo.png";
const Footer = () => {
  const quickLinks = [{
    name: "Study Center",
    href: "#study"
  }, {
    name: "Assignments",
    href: "#assignments"
  }, {
    name: "Exam Prep",
    href: "#exams"
  }, {
    name: "Research",
    href: "#research"
  }];
  const universities = ["University of Zimbabwe", "NUST", "Midlands State University", "Chinhoyi University of Technology", "Bindura University", "Great Zimbabwe University"];
  const resources = [{
    name: "Digital Libraries",
    href: "#libraries"
  }, {
    name: "Campus Maps",
    href: "#maps"
  }, {
    name: "Academic Calendar",
    href: "#calendar"
  }, {
    name: "Help Center",
    href: "#help"
  }];
  return <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-hero rounded-lg p-2">
                  <GraduationCap className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">ZimUni Hub</h3>
                  <p className="text-sm text-background/70">Academic Excellence Platform</p>
                </div>
              </div>
              
              <p className="text-background/80 text-sm leading-relaxed">
                Empowering Zimbabwean students with integrated access to university resources, 
                study materials, and academic support across all major institutions.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="hover:bg-background/10 text-background hover:text-background" asChild>
                  <a href="https://www.facebook.com/micheal.hore" target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-background/10 text-background hover:text-background">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-background/10 text-background hover:text-background">
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-background/10 text-background hover:text-background">
                  <Instagram className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => <li key={index}>
                    <a href={link.href} className="text-background/80 hover:text-background transition-colors text-sm">
                      {link.name}
                    </a>
                  </li>)}
              </ul>
            </div>

            {/* Universities */}
            <div>
              <h4 className="font-semibold text-lg mb-6">Partner Universities</h4>
              <ul className="space-y-3">
                {universities.map((uni, index) => <li key={index}>
                    <span className="text-background/80 text-sm">
                      {uni}
                    </span>
                  </li>)}
              </ul>
            </div>

            {/* Resources & Contact */}
            <div>
              <h4 className="font-semibold text-lg mb-6">Resources & Support</h4>
              <ul className="space-y-3 mb-6">
                {resources.map((resource, index) => <li key={index}>
                    <a href={resource.href} className="text-background/80 hover:text-background transition-colors text-sm">
                      {resource.name}
                    </a>
                  </li>)}
              </ul>

              {/* Contact Info */}
              <div className="space-y-3">
                <h5 className="font-medium text-background mb-2">Contact</h5>
                <div>
                  <p className="text-background text-sm font-medium">Miguel Hore</p>
                  <p className="text-background/70 text-xs mb-2">CEO & Founder, ZimUni Hub</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-background/60" />
                  <a href="mailto:Miguelhore250@gmail.com" className="text-background/80 hover:text-background text-sm transition-colors">
                    Miguelhore250@gmail.com
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-background/60" />
                  <a href="tel:+263785693657" className="text-background/80 hover:text-background text-sm transition-colors">
                    +263 785 693 657
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-background/60" />
                  <span className="text-background/80 text-sm">Chinhoyi University of Technology</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Branding Section */}
        <div className="py-8 border-t border-background/10">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-background/70 text-sm">A product of</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
              <div className="flex items-center gap-3">
                <img src={hgcLogo} alt="HGC Private Limited" className="h-12 w-12 object-contain rounded-lg" />
                <span className="text-background font-semibold">HGC Private Limited</span>
              </div>
              <div className="flex items-center gap-2 text-background/60">
                <span className="hidden sm:inline">|</span>
                <span className="text-background/70 text-sm">Proudly sponsored by</span>
              </div>
              <div className="flex items-center gap-3">
                <img src={tatendaLogo} alt="Tatenda Foundation" className="h-12 w-12 object-contain rounded-full" />
                <span className="text-background font-semibold">Tatenda Foundation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-background/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-background/60 text-sm">
              © 2024 ZimUni Hub. All rights reserved. Proudly serving Zimbabwe's academic community.
            </p>
            
            <div className="flex space-x-6 text-sm">
              <a href="#privacy" className="text-background/60 hover:text-background transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-background/60 hover:text-background transition-colors">
                Terms of Service
              </a>
              <a href="#cookies" className="text-background/60 hover:text-background transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;