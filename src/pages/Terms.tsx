import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Shield, Scale, Users, AlertTriangle, Gavel, RefreshCw, XCircle, Mail, Phone, MapPin, Calendar } from "lucide-react";

const Terms = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<string>("");

  const sections = [
    { id: "preamble", title: "Preamble", icon: FileText },
    { id: "definitions", title: "1. Definitions & Interpretation", icon: FileText },
    { id: "acceptance", title: "2. Acceptance & Contractual Capacity", icon: Users },
    { id: "ownership", title: "3. Ownership, IP & Licenses", icon: Shield },
    { id: "privacy", title: "4. Data Protection & Privacy", icon: Shield },
    { id: "conduct", title: "5. User Conduct & Prohibited Acts", icon: AlertTriangle },
    { id: "liability", title: "6. Liability & Disclaimers", icon: Scale },
    { id: "amendments", title: "7. Amendments & Due Process", icon: RefreshCw },
    { id: "termination", title: "8. Termination & Suspension", icon: XCircle },
    { id: "governing", title: "9. Governing Law & Disputes", icon: Gavel },
    { id: "contact", title: "Contact Information", icon: Mail },
  ];

  useEffect(() => {
    // Handle anchor links on page load
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location.hash]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 lg:py-20">
        <div className="container-responsive">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Scale className="h-3 w-3 mr-1" />
              Legal Document
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Terms and Conditions & Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Comprehensive legal agreement governing your use of ZimUni Hub
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Effective Date: 23 January 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                <span>Last Updated: 23 January 2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-16">
        <div className="container-responsive">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Table of Contents - Sticky Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-4">Table of Contents</h3>
                  <ScrollArea className="h-[60vh]">
                    <nav className="space-y-1">
                      {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                          <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                              activeSection === section.id
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{section.title}</span>
                          </button>
                        );
                      })}
                    </nav>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3 space-y-8">
              {/* Preamble */}
              <Card id="preamble" className="scroll-offset">
                <CardContent className="p-6 lg:p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-primary" />
                    Preamble
                  </h2>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      This document constitutes a legally binding agreement between HGC Private Limited 
                      (hereinafter referred to as "the Company," "we," "us," or "our") and any person or 
                      entity ("User," "you," or "your") who accesses or uses the ZimUni Hub platform 
                      ("Platform," "Service," or "Application").
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      This Agreement is drafted in accordance with and shall be interpreted pursuant to 
                      the laws of Zimbabwe, including but not limited to:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                      <li>The Constitution of Zimbabwe Amendment (No. 20) Act, 2013</li>
                      <li>The Cyber and Data Protection Act [Chapter 12:07]</li>
                      <li>The Access to Information and Protection of Privacy Act [Chapter 10:27]</li>
                      <li>The Electronic Transactions and Electronic Commerce Act [Chapter 21:22]</li>
                      <li>The Consumer Protection Act [Chapter 14:44]</li>
                      <li>The Contractual Penalties Act [Chapter 8:04]</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed">
                      By accessing or using our Platform, you acknowledge that you have read, understood, 
                      and agree to be bound by these Terms and Conditions and our integrated Privacy Policy. 
                      If you do not agree to these terms, you must not access or use the Platform.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Accordion Sections */}
              <Accordion type="multiple" className="space-y-4">
                {/* Section 1: Definitions */}
                <AccordionItem value="definitions" id="definitions" className="scroll-offset border rounded-lg bg-card">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <span className="flex items-center gap-2 text-lg font-semibold">
                      <FileText className="h-5 w-5 text-primary" />
                      1. Definitions & Interpretation
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <h4 className="font-semibold text-foreground mb-3">1.1 Key Definitions</h4>
                      <p className="text-muted-foreground mb-4">In this Agreement, unless the context otherwise requires:</p>
                      <ul className="space-y-3 text-muted-foreground">
                        <li><strong>"Account"</strong> means the unique user profile created upon registration, containing personal information, preferences, and access credentials.</li>
                        <li><strong>"Content"</strong> refers to all text, images, audio, video, data, code, and other materials displayed on or accessible through the Platform.</li>
                        <li><strong>"Intellectual Property Rights"</strong> includes patents, trademarks, service marks, trade names, copyrights, database rights, design rights, and all other intellectual property rights.</li>
                        <li><strong>"Personal Data"</strong> means any information relating to an identified or identifiable natural person as defined in the Cyber and Data Protection Act.</li>
                        <li><strong>"Platform"</strong> encompasses the ZimUni Hub website, mobile application, and all related services, features, and functionalities.</li>
                        <li><strong>"Processing"</strong> means any operation performed on personal data, including collection, storage, use, disclosure, and deletion.</li>
                        <li><strong>"User Content"</strong> means any content submitted, posted, or transmitted by users through the Platform.</li>
                      </ul>
                      
                      <h4 className="font-semibold text-foreground mt-6 mb-3">1.2 Interpretation Rules</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>Words importing the singular include the plural and vice versa.</li>
                        <li>References to legislation include amendments and re-enactments.</li>
                        <li>Headings are for convenience only and shall not affect interpretation.</li>
                        <li>Any reference to "writing" includes electronic communications.</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Section 2: Acceptance */}
                <AccordionItem value="acceptance" id="acceptance" className="scroll-offset border rounded-lg bg-card">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <span className="flex items-center gap-2 text-lg font-semibold">
                      <Users className="h-5 w-5 text-primary" />
                      2. Acceptance & Contractual Capacity
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <h4 className="font-semibold text-foreground mb-3">2.1 Agreement Formation</h4>
                      <p className="text-muted-foreground mb-4">
                        This Agreement becomes binding upon your first access to or use of the Platform. 
                        Continued use constitutes ongoing acceptance of these terms as amended from time to time.
                      </p>
                      
                      <h4 className="font-semibold text-foreground mb-3">2.2 Capacity to Contract</h4>
                      <p className="text-muted-foreground mb-4">By using this Platform, you represent and warrant that:</p>
                      <ul className="space-y-2 text-muted-foreground mb-4">
                        <li>You are at least 18 years of age, or if under 18, you have obtained parental or guardian consent.</li>
                        <li>You have the legal capacity to enter into binding contracts under Zimbabwean law.</li>
                        <li>You are not prohibited by law from accessing or using such services.</li>
                        <li>All information you provide is accurate, current, and complete.</li>
                      </ul>
                      
                      <h4 className="font-semibold text-foreground mb-3">2.3 Account Registration</h4>
                      <p className="text-muted-foreground">
                        Users must register for an account to access certain features. You are responsible for 
                        maintaining the confidentiality of your login credentials and for all activities conducted 
                        through your account. You must notify us immediately of any unauthorized access.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Section 3: Ownership & IP */}
                <AccordionItem value="ownership" id="ownership" className="scroll-offset border rounded-lg bg-card">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <span className="flex items-center gap-2 text-lg font-semibold">
                      <Shield className="h-5 w-5 text-primary" />
                      3. Ownership, Intellectual Property & Licenses
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <h4 className="font-semibold text-foreground mb-3">3.1 Company's Intellectual Property</h4>
                      <p className="text-muted-foreground mb-4">
                        All intellectual property rights in the Platform, including but not limited to the software, 
                        design, graphics, logos, trademarks, and content (excluding User Content), are owned by 
                        HGC Private Limited or its licensors and are protected under Zimbabwean and international law.
                      </p>
                      
                      <h4 className="font-semibold text-foreground mb-3">3.2 Limited License to Users</h4>
                      <p className="text-muted-foreground mb-4">
                        Subject to your compliance with these Terms, we grant you a limited, non-exclusive, 
                        non-transferable, revocable license to access and use the Platform for personal, 
                        non-commercial educational purposes.
                      </p>
                      
                      <h4 className="font-semibold text-foreground mb-3">3.3 User Content License</h4>
                      <p className="text-muted-foreground mb-4">
                        By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license 
                        to use, reproduce, modify, and display such content for the purpose of operating and 
                        improving the Platform. You retain ownership of your User Content.
                      </p>
                      
                      <h4 className="font-semibold text-foreground mb-3">3.4 Restrictions</h4>
                      <p className="text-muted-foreground">You may not:</p>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>Copy, modify, or distribute Platform content without authorization.</li>
                        <li>Reverse engineer, decompile, or disassemble any software.</li>
                        <li>Use automated systems to access the Platform without permission.</li>
                        <li>Remove or alter any proprietary notices or labels.</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Section 4: Privacy (Integrated Policy) */}
                <AccordionItem value="privacy" id="privacy" className="scroll-offset border rounded-lg bg-card">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <span className="flex items-center gap-2 text-lg font-semibold">
                      <Shield className="h-5 w-5 text-primary" />
                      4. Data Protection & Privacy Rights
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
                        <p className="text-sm text-primary font-medium">
                          This section constitutes our Privacy Policy in compliance with the Cyber and Data Protection Act [Chapter 12:07].
                        </p>
                      </div>
                      
                      <h4 className="font-semibold text-foreground mb-3">4.1 Data We Collect</h4>
                      <ul className="space-y-2 text-muted-foreground mb-4">
                        <li><strong>Personal Information:</strong> Name, email address, phone number, student ID, university affiliation.</li>
                        <li><strong>Account Data:</strong> Username, password (encrypted), profile preferences.</li>
                        <li><strong>Usage Data:</strong> Login times, feature usage, study session data.</li>
                        <li><strong>Device Information:</strong> IP address, browser type, device identifiers.</li>
                        <li><strong>Academic Data:</strong> Courses enrolled, assignments, quiz scores, study progress.</li>
                      </ul>
                      
                      <h4 className="font-semibold text-foreground mb-3" id="cookies">4.2 Cookies and Tracking</h4>
                      <p className="text-muted-foreground mb-4">
                        We use essential cookies for Platform functionality and optional analytics cookies to 
                        improve our services. You may disable non-essential cookies through your browser settings.
                      </p>
                      
                      <h4 className="font-semibold text-foreground mb-3">4.3 Purpose of Processing</h4>
                      <p className="text-muted-foreground mb-4">We process your data to:</p>
                      <ul className="space-y-2 text-muted-foreground mb-4">
                        <li>Provide and improve our educational services.</li>
                        <li>Personalize your learning experience.</li>
                        <li>Communicate important updates and notifications.</li>
                        <li>Ensure platform security and prevent fraud.</li>
                        <li>Comply with legal obligations.</li>
                      </ul>
                      
                      <h4 className="font-semibold text-foreground mb-3">4.4 Your Rights</h4>
                      <p className="text-muted-foreground mb-4">Under the Cyber and Data Protection Act, you have the right to:</p>
                      <ul className="space-y-2 text-muted-foreground mb-4">
                        <li>Access your personal data.</li>
                        <li>Rectify inaccurate information.</li>
                        <li>Request deletion of your data (subject to legal requirements).</li>
                        <li>Object to certain processing activities.</li>
                        <li>Data portability where technically feasible.</li>
                        <li>Lodge a complaint with the Postal and Telecommunications Regulatory Authority of Zimbabwe (POTRAZ).</li>
                      </ul>
                      
                      <h4 className="font-semibold text-foreground mb-3">4.5 Data Retention</h4>
                      <p className="text-muted-foreground mb-4">
                        We retain personal data only for as long as necessary to fulfill the purposes for which 
                        it was collected, or as required by law. Academic records may be retained for extended 
                        periods for verification purposes.
                      </p>
                      
                      <h4 className="font-semibold text-foreground mb-3">4.6 Data Security</h4>
                      <p className="text-muted-foreground">
                        We implement appropriate technical and organizational measures to protect your data, 
                        including encryption, access controls, and regular security audits. However, no system 
                        is completely secure, and we cannot guarantee absolute security.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Section 5: User Conduct */}
                <AccordionItem value="conduct" id="conduct" className="scroll-offset border rounded-lg bg-card">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <span className="flex items-center gap-2 text-lg font-semibold">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                      5. User Conduct & Prohibited Acts
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <h4 className="font-semibold text-foreground mb-3">5.1 Acceptable Use</h4>
                      <p className="text-muted-foreground mb-4">
                        You agree to use the Platform only for lawful educational purposes in accordance with 
                        these Terms and all applicable Zimbabwean laws.
                      </p>
                      
                      <h4 className="font-semibold text-foreground mb-3">5.2 Prohibited Activities</h4>
                      <p className="text-muted-foreground mb-4">You must not:</p>
                      <ul className="space-y-2 text-muted-foreground mb-4">
                        <li>Submit false, misleading, or fraudulent information.</li>
                        <li>Impersonate any person or entity.</li>
                        <li>Upload malicious software or harmful content.</li>
                        <li>Attempt to gain unauthorized access to the Platform or other users' accounts.</li>
                        <li>Engage in academic dishonesty or plagiarism.</li>
                        <li>Harass, threaten, or defame other users.</li>
                        <li>Share or distribute copyrighted content without authorization.</li>
                        <li>Use the Platform for commercial purposes without permission.</li>
                        <li>Violate any applicable laws or regulations.</li>
                      </ul>
                      
                      <h4 className="font-semibold text-foreground mb-3">5.3 Content Standards</h4>
                      <p className="text-muted-foreground">
                        All User Content must be accurate, not misleading, and must not infringe on any 
                        third-party rights. We reserve the right to remove any content that violates these standards.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Section 6: Liability */}
                <AccordionItem value="liability" id="liability" className="scroll-offset border rounded-lg bg-card">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <span className="flex items-center gap-2 text-lg font-semibold">
                      <Scale className="h-5 w-5 text-primary" />
                      6. Liability, Warranty Disclaimers & Indemnity
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <h4 className="font-semibold text-foreground mb-3">6.1 Disclaimer of Warranties</h4>
                      <p className="text-muted-foreground mb-4">
                        THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                        EITHER EXPRESS OR IMPLIED. We do not warrant that the Platform will be uninterrupted, 
                        error-free, or completely secure.
                      </p>
                      
                      <h4 className="font-semibold text-foreground mb-3">6.2 Limitation of Liability</h4>
                      <p className="text-muted-foreground mb-4">
                        To the maximum extent permitted by Zimbabwean law, HGC Private Limited shall not be 
                        liable for any indirect, incidental, special, consequential, or punitive damages arising 
                        from your use of the Platform.
                      </p>
                      
                      <h4 className="font-semibold text-foreground mb-3">6.3 Educational Content Disclaimer</h4>
                      <p className="text-muted-foreground mb-4">
                        Educational materials on the Platform are for informational purposes only and do not 
                        constitute professional academic advice. We are not responsible for academic outcomes 
                        based on Platform usage.
                      </p>
                      
                      <h4 className="font-semibold text-foreground mb-3">6.4 Indemnification</h4>
                      <p className="text-muted-foreground">
                        You agree to indemnify and hold harmless HGC Private Limited, its directors, employees, 
                        and agents from any claims, damages, or expenses arising from your violation of these 
                        Terms or your use of the Platform.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Section 7: Amendments */}
                <AccordionItem value="amendments" id="amendments" className="scroll-offset border rounded-lg bg-card">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <span className="flex items-center gap-2 text-lg font-semibold">
                      <RefreshCw className="h-5 w-5 text-primary" />
                      7. Amendments & Due Process
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <h4 className="font-semibold text-foreground mb-3">7.1 Right to Amend</h4>
                      <p className="text-muted-foreground mb-4">
                        We reserve the right to modify these Terms at any time. Material changes will be 
                        communicated through the Platform or via email at least 14 days before taking effect.
                      </p>
                      
                      <h4 className="font-semibold text-foreground mb-3">7.2 Notification of Changes</h4>
                      <p className="text-muted-foreground mb-4">
                        We will notify users of significant changes via email, in-app notifications, or 
                        prominent notice on the Platform. The "Last Updated" date will reflect the most recent revision.
                      </p>
                      
                      <h4 className="font-semibold text-foreground mb-3">7.3 Continued Use</h4>
                      <p className="text-muted-foreground">
                        Your continued use of the Platform after the effective date of any changes constitutes 
                        acceptance of the modified Terms. If you disagree with any changes, you must discontinue 
                        use and close your account.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Section 8: Termination */}
                <AccordionItem value="termination" id="termination" className="scroll-offset border rounded-lg bg-card">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <span className="flex items-center gap-2 text-lg font-semibold">
                      <XCircle className="h-5 w-5 text-primary" />
                      8. Termination & Suspension
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <h4 className="font-semibold text-foreground mb-3">8.1 Termination by User</h4>
                      <p className="text-muted-foreground mb-4">
                        You may terminate your account at any time by contacting us or using the account 
                        deletion feature. Upon termination, your right to use the Platform will cease immediately.
                      </p>
                      
                      <h4 className="font-semibold text-foreground mb-3">8.2 Termination by Company</h4>
                      <p className="text-muted-foreground mb-4">
                        We may suspend or terminate your account immediately if you violate these Terms, 
                        engage in prohibited activities, or for any other reason at our discretion with or 
                        without notice.
                      </p>
                      
                      <h4 className="font-semibold text-foreground mb-3">8.3 Effect of Termination</h4>
                      <p className="text-muted-foreground mb-4">Upon termination:</p>
                      <ul className="space-y-2 text-muted-foreground mb-4">
                        <li>Your license to use the Platform terminates.</li>
                        <li>You must cease all use of the Platform.</li>
                        <li>We may delete your account data (subject to legal retention requirements).</li>
                        <li>Provisions that by their nature should survive will remain in effect.</li>
                      </ul>
                      
                      <h4 className="font-semibold text-foreground mb-3">8.4 Data Export</h4>
                      <p className="text-muted-foreground">
                        Prior to account termination, you may request a copy of your personal data in accordance 
                        with your rights under the Cyber and Data Protection Act.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Section 9: Governing Law */}
                <AccordionItem value="governing" id="governing" className="scroll-offset border rounded-lg bg-card">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <span className="flex items-center gap-2 text-lg font-semibold">
                      <Gavel className="h-5 w-5 text-primary" />
                      9. Governing Law & Dispute Resolution
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <h4 className="font-semibold text-foreground mb-3">9.1 Governing Law</h4>
                      <p className="text-muted-foreground mb-4">
                        This Agreement shall be governed by and construed in accordance with the laws of the 
                        Republic of Zimbabwe, without regard to conflict of law principles.
                      </p>
                      
                      <h4 className="font-semibold text-foreground mb-3">9.2 Dispute Resolution</h4>
                      <p className="text-muted-foreground mb-4">
                        Any dispute arising from or relating to this Agreement shall first be attempted to 
                        be resolved through good faith negotiation between the parties for a period of not 
                        less than 30 days.
                      </p>
                      
                      <h4 className="font-semibold text-foreground mb-3">9.3 Mediation</h4>
                      <p className="text-muted-foreground mb-4">
                        If negotiation fails, the parties agree to submit the dispute to mediation under the 
                        rules of the Commercial Arbitration Centre of Zimbabwe before pursuing other remedies.
                      </p>
                      
                      <h4 className="font-semibold text-foreground mb-3">9.4 Jurisdiction</h4>
                      <p className="text-muted-foreground mb-4">
                        Subject to the above, the courts of Zimbabwe shall have exclusive jurisdiction to 
                        adjudicate any dispute arising under this Agreement.
                      </p>
                      
                      <h4 className="font-semibold text-foreground mb-3">9.5 Severability</h4>
                      <p className="text-muted-foreground">
                        If any provision of this Agreement is found to be invalid or unenforceable, the 
                        remaining provisions shall continue in full force and effect.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Contact Information */}
              <Card id="contact" className="scroll-offset">
                <CardContent className="p-6 lg:p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Mail className="h-6 w-6 text-primary" />
                    Contact Information
                  </h2>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground mb-6">
                      For questions, concerns, or requests regarding these Terms and Conditions or our Privacy Policy, 
                      please contact us using the following details:
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">HGC Private Limited</h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-muted-foreground">
                              27174 Unit N Extension<br />
                              Seke, Chitungwiza<br />
                              Zimbabwe
                            </p>
                          </div>
                          <a href="mailto:HGCPrivatelimitedzim@gmail.com" className="flex items-center gap-3 text-primary hover:text-primary-glow transition-colors">
                            <Mail className="h-5 w-5 shrink-0" />
                            HGCPrivatelimitedzim@gmail.com
                          </a>
                          <a href="tel:+263785693657" className="flex items-center gap-3 text-primary hover:text-primary-glow transition-colors">
                            <Phone className="h-5 w-5 shrink-0" />
                            +263 785 693 657
                          </a>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Data Protection Inquiries</h4>
                        <p className="text-muted-foreground">
                          For data protection and privacy-related matters, or to exercise your rights under the 
                          Cyber and Data Protection Act, please email us with the subject line "Data Protection Request."
                        </p>
                        <p className="text-sm text-muted-foreground">
                          We aim to respond to all inquiries within 14 business days.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Print Notice */}
              <div className="text-center text-sm text-muted-foreground py-4">
                <p>This document may be printed for your records. Last updated: 23 January 2026.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;
