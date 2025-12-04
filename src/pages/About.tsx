import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Heart, 
  Target, 
  Users, 
  Globe, 
  Award,
  Handshake,
  GraduationCap,
  Lightbulb,
  TrendingUp
} from "lucide-react";
import hgcLogo from "@/assets/hgc-logo.png";
import tatendaLogo from "@/assets/tatenda-foundation-logo.png";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              About <span className="text-primary">ZimUni Hub</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Empowering Zimbabwean students with world-class academic resources through 
              innovation, partnership, and a commitment to educational excellence.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground">Our Story</h2>
                <p className="text-muted-foreground leading-relaxed">
                  ZimUni Hub was born from a vision to transform how Zimbabwean university students 
                  access and engage with academic resources. Founded by Miguel Hore, a student at 
                  Chinhoyi University of Technology, this platform addresses the real challenges 
                  faced by students across the nation.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  What started as a simple idea to help fellow students has grown into a comprehensive 
                  academic success platform, connecting students from all major universities in Zimbabwe 
                  with the resources they need to excel in their studies.
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <GraduationCap className="h-12 w-12 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">Miguel Hore</p>
                    <p className="text-sm text-muted-foreground">Founder & CEO, ZimUni Hub</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-card border-border">
                  <CardContent className="p-6 text-center">
                    <Users className="h-10 w-10 text-primary mx-auto mb-3" />
                    <p className="text-3xl font-bold text-foreground">10,000+</p>
                    <p className="text-sm text-muted-foreground">Active Students</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-6 text-center">
                    <Building2 className="h-10 w-10 text-primary mx-auto mb-3" />
                    <p className="text-3xl font-bold text-foreground">15+</p>
                    <p className="text-sm text-muted-foreground">Partner Universities</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-6 text-center">
                    <Globe className="h-10 w-10 text-primary mx-auto mb-3" />
                    <p className="text-3xl font-bold text-foreground">50,000+</p>
                    <p className="text-sm text-muted-foreground">Resources Available</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-6 text-center">
                    <Award className="h-10 w-10 text-primary mx-auto mb-3" />
                    <p className="text-3xl font-bold text-foreground">95%</p>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-8">
                  <Target className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To democratize access to quality academic resources for every Zimbabwean 
                    university student, breaking down barriers to educational success through 
                    technology and innovation. We believe that every student deserves the tools 
                    and support needed to achieve their academic goals.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                <CardContent className="p-8">
                  <Lightbulb className="h-12 w-12 text-secondary-foreground mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To become the leading academic success platform in Africa, fostering a 
                    community of empowered learners who are equipped to lead and innovate 
                    in their respective fields. We envision a future where no student is 
                    left behind due to lack of access to educational resources.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Partnership Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Handshake className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Partners</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                ZimUni Hub is made possible through the vision and support of our founding partners 
                who share our commitment to transforming education in Zimbabwe.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* HGC Private Limited */}
              <Card className="bg-card border-border overflow-hidden">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={hgcLogo} 
                      alt="HGC Private Limited" 
                      className="h-20 w-20 object-contain rounded-xl"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-white">HGC Private Limited</h3>
                      <p className="text-slate-300">Technology & Innovation Partner</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    HGC Private Limited is the proud creator and developer of ZimUni Hub. As a 
                    forward-thinking technology company based in Zimbabwe, HGC is committed to 
                    building innovative solutions that address real challenges in education, 
                    healthcare, and business.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-foreground">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm">Leading technology innovation in Zimbabwe</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <Building2 className="h-4 w-4 text-primary" />
                      <span className="text-sm">Developing solutions for African markets</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm">Empowering communities through technology</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tatenda Foundation */}
              <Card className="bg-card border-border overflow-hidden">
                <div className="bg-gradient-to-r from-amber-700 to-amber-900 p-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={tatendaLogo} 
                      alt="Tatenda Foundation" 
                      className="h-20 w-20 object-contain rounded-full"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-white">Tatenda Foundation</h3>
                      <p className="text-amber-200">Official Sponsor</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Tatenda Foundation is proud to sponsor ZimUni Hub as part of its mission to 
                    support educational initiatives across Zimbabwe. The foundation believes in 
                    investing in the future by empowering young people with access to knowledge 
                    and opportunities.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-foreground">
                      <Heart className="h-4 w-4 text-primary" />
                      <span className="text-sm">Supporting educational access for all</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <span className="text-sm">Scholarship programs for underprivileged students</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <Globe className="h-4 w-4 text-primary" />
                      <span className="text-sm">Community development initiatives</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Core Values</h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-card border-border text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="h-7 w-7 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Innovation</h4>
                  <p className="text-sm text-muted-foreground">
                    Continuously improving and adapting to serve students better
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Community</h4>
                  <p className="text-sm text-muted-foreground">
                    Building connections between students across universities
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Award className="h-7 w-7 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Excellence</h4>
                  <p className="text-sm text-muted-foreground">
                    Striving for the highest quality in everything we do
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-7 w-7 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Accessibility</h4>
                  <p className="text-sm text-muted-foreground">
                    Making education resources available to every student
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Join Us in Transforming Education
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Be part of the movement to empower Zimbabwean students. Whether you're a student, 
              educator, or potential partner, there's a place for you at ZimUni Hub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-hero hover:shadow-glow transition-all">
                  Get Started Today
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">
                  Partner With Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;