import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import hgcLogo from "@/assets/hgc-logo.png";
import tatendaLogo from "@/assets/tatenda-foundation-logo.png";

const Footer = () => {
  const quickLinks = [
    { name: "Study Center", href: "/study-center" },
    { name: "Libraries", href: "/libraries" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Campus", href: "/campus" }
  ];
  
  const universities = [
    "University of Zimbabwe", 
    "NUST", 
    "Midlands State University", 
    "Chinhoyi University of Technology", 
    "Bindura University", 
    "Great Zimbabwe University"
  ];
  
  const resources = [
    { name: "Digital Libraries", href: "/libraries" },
    { name: "Campus Maps", href: "/campus" },
    { name: "Academic Calendar", href: "/dashboard" },
    { name: "Contact Us", href: "/contact" }
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="container-responsive">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-hero rounded-lg p-2.5">
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
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" className="hover:bg-background/10 text-background hover:text-background rounded-full" asChild>
                  <a href="https://www.facebook.com/micheal.hore" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <Facebook className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-background/10 text-background hover:text-background rounded-full" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-background/10 text-background hover:text-background rounded-full" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-background/10 text-background hover:text-background rounded-full" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.href} className="text-background/80 hover:text-background transition-colors text-sm hover:underline underline-offset-4">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Universities */}
            <div>
              <h4 className="font-semibold text-lg mb-6">Partner Universities</h4>
              <ul className="space-y-3">
                {universities.map((uni, index) => (
                  <li key={index}>
                    <span className="text-background/80 text-sm">
                      {uni}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources & Contact */}
            <div>
              <h4 className="font-semibold text-lg mb-6">Resources & Support</h4>
              <ul className="space-y-3 mb-6">
                {resources.map((resource, index) => (
                  <li key={index}>
                    <Link to={resource.href} className="text-background/80 hover:text-background transition-colors text-sm hover:underline underline-offset-4">
                      {resource.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Contact Info */}
              <div className="space-y-3">
                <h5 className="font-medium text-background mb-2">Contact</h5>
                <div>
                  <p className="text-background text-sm font-medium">Miguel Hore</p>
                  <p className="text-background/70 text-xs mb-2">CEO & Founder, ZimUni Hub</p>
                </div>
                <a href="mailto:Miguelhore250@gmail.com" className="flex items-center space-x-2 text-background/80 hover:text-background text-sm transition-colors group">
                  <Mail className="h-4 w-4 text-background/60 group-hover:text-background" />
                  <span className="hover:underline underline-offset-4">Miguelhore250@gmail.com</span>
                </a>
                <a href="tel:+263785693657" className="flex items-center space-x-2 text-background/80 hover:text-background text-sm transition-colors group">
                  <Phone className="h-4 w-4 text-background/60 group-hover:text-background" />
                  <span className="hover:underline underline-offset-4">+263 785 693 657</span>
                </a>
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
              <div className="flex items-center gap-3">
                <img src={hgcLogo} alt="HGC Private Limited" className="h-12 w-12 object-contain rounded-lg bg-background/10 p-1" />
                <span className="text-background font-semibold">HGC Private Limited</span>
              </div>
              <span className="hidden sm:inline text-background/40">|</span>
              <div className="flex items-center gap-2 text-background/60 sm:hidden">
                <span className="text-background/70 text-sm">Proudly sponsored by</span>
              </div>
              <div className="flex items-center gap-3">
                <img src={tatendaLogo} alt="Tatenda Foundation" className="h-12 w-12 object-contain rounded-full bg-background/10 p-1" />
                <span className="text-background font-semibold">Tatenda Foundation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-background/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-background/60 text-sm text-center md:text-left">
              © {new Date().getFullYear()} ZimUni Hub. All rights reserved. Proudly serving Zimbabwe's academic community.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
              <a href="#privacy" className="text-background/60 hover:text-background transition-colors hover:underline underline-offset-4">
                Privacy Policy
              </a>
              <a href="#terms" className="text-background/60 hover:text-background transition-colors hover:underline underline-offset-4">
                Terms of Service
              </a>
              <a href="#cookies" className="text-background/60 hover:text-background transition-colors hover:underline underline-offset-4">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
