import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Database, 
  Search, 
  Filter, 
  BookOpen, 
  FileText, 
  Globe, 
  Download,
  Eye,
  Star,
  Clock,
  Users,
  ExternalLink,
  University,
  Bookmark,
  X
} from "lucide-react";
import Header from "@/components/Header";

const Libraries = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [accessFilter, setAccessFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");

  const digitalLibraries = [
    {
      name: "University of Zimbabwe Digital Repository",
      university: "University of Zimbabwe",
      type: "Institutional Repository",
      resources: "45,000+",
      subjects: ["Science", "Engineering", "Medicine", "Arts"],
      access: "Full Access",
      url: "https://ir.uz.ac.zw",
      description: "Complete collection of UZ theses, dissertations, and research publications."
    },
    {
      name: "NUST Research Database",
      university: "NUST",
      type: "Research Database",
      resources: "25,000+",
      subjects: ["Technology", "Engineering", "Applied Sciences"],
      access: "Full Access",
      url: "https://www.nust.ac.zw/library",
      description: "NUST's comprehensive database of technological research and innovations."
    },
    {
      name: "Zimbabwe Academic Library Consortium",
      university: "Multi-University",
      type: "Consortium Database",
      resources: "150,000+",
      subjects: ["All Disciplines"],
      access: "Limited Access",
      url: "https://www.zalico.co.zw",
      description: "Shared academic resources across all major Zimbabwe universities."
    },
    {
      name: "Midlands State University Repository",
      university: "Midlands State University",
      type: "Institutional Repository",
      resources: "18,000+",
      subjects: ["Social Sciences", "Commerce", "Natural Sciences", "Education"],
      access: "Full Access",
      url: "https://ir.msu.ac.zw",
      description: "MSU's digital archive of academic research, theses, and scholarly publications."
    },
    {
      name: "Great Zimbabwe University Digital Library",
      university: "Great Zimbabwe University",
      type: "Digital Library",
      resources: "12,000+",
      subjects: ["Heritage Studies", "Arts", "Agriculture", "Education"],
      access: "Full Access",
      url: "https://www.gzu.ac.zw/library",
      description: "GZU's collection focusing on heritage, culture, and regional development research."
    },
    {
      name: "Bindura University Research Repository",
      university: "Bindura University",
      type: "Research Repository",
      resources: "8,500+",
      subjects: ["Science Education", "Agriculture", "Environmental Studies"],
      access: "Full Access",
      url: "https://www.buse.ac.zw/library",
      description: "BUSE's specialized collection in science education and agricultural research."
    },
    {
      name: "Chinhoyi University of Technology Library",
      university: "CUT",
      type: "Digital Repository",
      resources: "10,000+",
      subjects: ["Technology", "Hospitality", "Wildlife Management", "Business"],
      access: "Full Access",
      url: "https://www.cut.ac.zw/cutlib/",
      description: "CUT's research database focusing on technology, tourism, and wildlife sciences."
    },
    {
      name: "Africa University Digital Commons",
      university: "Africa University",
      type: "Digital Commons",
      resources: "15,000+",
      subjects: ["Theology", "Peace Studies", "Health Sciences", "Agriculture"],
      access: "Full Access",
      url: "https://www.africau.edu/library",
      description: "Pan-African scholarly collection with focus on development and peace studies."
    }
  ];

  const researchDatabases = [
    {
      name: "JSTOR Academic",
      provider: "JSTOR",
      type: "Academic Journals",
      subjects: ["History", "Literature", "Political Science", "Economics"],
      articles: "2.5M+",
      access: "Subscription Required",
      url: "https://www.jstor.org",
      description: "Comprehensive academic journal archive with full-text access."
    },
    {
      name: "IEEE Xplore Digital Library",
      provider: "IEEE",
      type: "Technical Literature",
      subjects: ["Engineering", "Computer Science", "Electronics"],
      articles: "5M+",
      access: "University Access",
      url: "https://ieeexplore.ieee.org",
      description: "Leading database for electrical engineering and computer science research."
    },
    {
      name: "PubMed Central",
      provider: "NCBI",
      type: "Medical Literature",
      subjects: ["Medicine", "Biology", "Life Sciences"],
      articles: "7M+",
      access: "Open Access",
      url: "https://www.ncbi.nlm.nih.gov/pmc",
      description: "Free full-text archive of biomedical and life sciences journal literature."
    },
    {
      name: "SpringerLink",
      provider: "Springer",
      type: "Academic Publishing",
      subjects: ["Science", "Technology", "Medicine", "Business"],
      articles: "13M+",
      access: "Subscription Required",
      url: "https://link.springer.com",
      description: "Comprehensive collection of scientific, technical and medical content."
    },
    {
      name: "Google Scholar",
      provider: "Google",
      type: "Search Engine",
      subjects: ["All Disciplines"],
      articles: "400M+",
      access: "Open Access",
      url: "https://scholar.google.com",
      description: "Freely accessible search engine for scholarly literature across all fields."
    },
    {
      name: "Scopus",
      provider: "Elsevier",
      type: "Citation Database",
      subjects: ["Science", "Technology", "Medicine", "Social Sciences"],
      articles: "90M+",
      access: "Subscription Required",
      url: "https://www.scopus.com",
      description: "Largest abstract and citation database of peer-reviewed literature."
    },
    {
      name: "Web of Science",
      provider: "Clarivate",
      type: "Citation Index",
      subjects: ["Sciences", "Social Sciences", "Arts & Humanities"],
      articles: "85M+",
      access: "Subscription Required",
      url: "https://www.webofscience.com",
      description: "Multidisciplinary research platform with citation network analysis."
    },
    {
      name: "Directory of Open Access Journals (DOAJ)",
      provider: "DOAJ",
      type: "Open Access Directory",
      subjects: ["All Disciplines"],
      articles: "9M+",
      access: "Open Access",
      url: "https://doaj.org",
      description: "Community-curated index of high-quality open access journals."
    },
    {
      name: "African Journals Online (AJOL)",
      provider: "AJOL",
      type: "African Research",
      subjects: ["African Studies", "Health", "Agriculture", "Environment"],
      articles: "200K+",
      access: "Mixed Access",
      url: "https://www.ajol.info",
      description: "Largest collection of peer-reviewed African-published scholarly journals."
    },
    {
      name: "ScienceDirect",
      provider: "Elsevier",
      type: "Scientific Database",
      subjects: ["Physical Sciences", "Engineering", "Life Sciences", "Health Sciences"],
      articles: "16M+",
      access: "Subscription Required",
      url: "https://www.sciencedirect.com",
      description: "Leading full-text scientific database with peer-reviewed journal articles."
    },
    {
      name: "arXiv",
      provider: "Cornell University",
      type: "Preprint Server",
      subjects: ["Physics", "Mathematics", "Computer Science", "Quantitative Biology"],
      articles: "2.3M+",
      access: "Open Access",
      url: "https://arxiv.org",
      description: "Open-access archive for scholarly articles in STEM fields before peer review."
    },
    {
      name: "ERIC (Education Resources)",
      provider: "US Department of Education",
      type: "Education Database",
      subjects: ["Education", "Teaching", "Learning Sciences"],
      articles: "1.8M+",
      access: "Open Access",
      url: "https://eric.ed.gov",
      description: "Comprehensive education research and information database."
    },
    {
      name: "ProQuest Dissertations & Theses",
      provider: "ProQuest",
      type: "Thesis Repository",
      subjects: ["All Disciplines"],
      articles: "5M+",
      access: "Subscription Required",
      url: "https://www.proquest.com/pqdtglobal",
      description: "World's most comprehensive collection of dissertations and theses."
    },
    {
      name: "ResearchGate",
      provider: "ResearchGate",
      type: "Academic Network",
      subjects: ["All Disciplines"],
      articles: "160M+",
      access: "Free Registration",
      url: "https://www.researchgate.net",
      description: "Professional network for researchers to share and discover research."
    },
    {
      name: "SABINET African Journals",
      provider: "SABINET",
      type: "African Scholarly Content",
      subjects: ["African Studies", "Law", "Health", "Social Sciences"],
      articles: "500K+",
      access: "Subscription Required",
      url: "https://journals.co.za",
      description: "Southern African and African scholarly journal content aggregator."
    },
    {
      name: "WorldCat",
      provider: "OCLC",
      type: "Library Catalog",
      subjects: ["All Disciplines"],
      articles: "500M+",
      access: "Open Access",
      url: "https://www.worldcat.org",
      description: "World's largest network of library content and services."
    }
  ];

  const recentResources = [
    {
      title: "Machine Learning Applications in Agriculture",
      author: "Dr. T. Mukamuri et al.",
      journal: "Zimbabwe Journal of Technology",
      year: "2024",
      type: "Research Paper",
      downloads: 234,
      rating: 4.8
    },
    {
      title: "Economic Impact of Mining in Zimbabwe",
      author: "Prof. S. Chigondo",
      journal: "African Economic Review",
      year: "2023",
      type: "Review Article",
      downloads: 567,
      rating: 4.9
    },
    {
      title: "Climate Change Adaptation Strategies",
      author: "Dr. M. Mutasa",
      journal: "Environmental Science Zimbabwe",
      year: "2024",
      type: "Case Study",
      downloads: 189,
      rating: 4.6
    }
  ];

  const popularSubjects = [
    { name: "Computer Science", resources: "12,450", trend: "+15%" },
    { name: "Medicine", resources: "8,230", trend: "+12%" },
    { name: "Engineering", resources: "9,100", trend: "+18%" },
    { name: "Business", resources: "6,780", trend: "+8%" },
    { name: "Agriculture", resources: "5,450", trend: "+22%" },
    { name: "Education", resources: "4,890", trend: "+10%" }
  ];

  // Get all unique subjects from libraries and databases
  const allSubjects = useMemo(() => {
    const subjects = new Set<string>();
    digitalLibraries.forEach(lib => lib.subjects.forEach(s => subjects.add(s)));
    researchDatabases.forEach(db => db.subjects.forEach(s => subjects.add(s)));
    return Array.from(subjects).sort();
  }, []);

  // Get all unique access types
  const allAccessTypes = useMemo(() => {
    const accessTypes = new Set<string>();
    digitalLibraries.forEach(lib => accessTypes.add(lib.access));
    researchDatabases.forEach(db => accessTypes.add(db.access));
    return Array.from(accessTypes).sort();
  }, []);

  // Filter libraries
  const filteredLibraries = useMemo(() => {
    return digitalLibraries.filter(library => {
      const matchesSearch = searchQuery === "" || 
        library.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        library.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        library.university.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesAccess = accessFilter === "all" || library.access === accessFilter;
      
      const matchesSubject = subjectFilter === "all" || 
        library.subjects.some(s => s === subjectFilter);
      
      return matchesSearch && matchesAccess && matchesSubject;
    });
  }, [searchQuery, accessFilter, subjectFilter]);

  // Filter databases
  const filteredDatabases = useMemo(() => {
    return researchDatabases.filter(database => {
      const matchesSearch = searchQuery === "" || 
        database.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        database.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        database.provider.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesAccess = accessFilter === "all" || database.access === accessFilter;
      
      const matchesSubject = subjectFilter === "all" || 
        database.subjects.some(s => s === subjectFilter);
      
      return matchesSearch && matchesAccess && matchesSubject;
    });
  }, [searchQuery, accessFilter, subjectFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setAccessFilter("all");
    setSubjectFilter("all");
  };

  const hasActiveFilters = searchQuery !== "" || accessFilter !== "all" || subjectFilter !== "all";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Digital Libraries</h1>
          <p className="text-muted-foreground">
            Access comprehensive academic resources and research databases from Zimbabwe's leading universities
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search across all libraries and databases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={accessFilter} onValueChange={setAccessFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Access Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Access Types</SelectItem>
                {allAccessTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Subject Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {allSubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{searchQuery}"
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => setSearchQuery("")}
                  />
                </Badge>
              )}
              {accessFilter !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Access: {accessFilter}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => setAccessFilter("all")}
                  />
                </Badge>
              )}
              {subjectFilter !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Subject: {subjectFilter}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => setSubjectFilter("all")}
                  />
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-6">
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-card border-border text-center p-4">
            <div className="text-2xl font-bold text-primary">250K+</div>
            <div className="text-sm text-muted-foreground">Total Resources</div>
          </Card>
          <Card className="bg-gradient-card border-border text-center p-4">
            <div className="text-2xl font-bold text-secondary">15</div>
            <div className="text-sm text-muted-foreground">Universities</div>
          </Card>
          <Card className="bg-gradient-card border-border text-center p-4">
            <div className="text-2xl font-bold text-primary">50+</div>
            <div className="text-sm text-muted-foreground">Databases</div>
          </Card>
          <Card className="bg-gradient-card border-border text-center p-4">
            <div className="text-2xl font-bold text-secondary">24/7</div>
            <div className="text-sm text-muted-foreground">Access</div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="libraries" className="space-y-6">
          <TabsList className="flex flex-wrap justify-start gap-1 h-auto p-1 bg-card/50 border border-border/30 rounded-xl w-full md:w-fit">
            <TabsTrigger 
              value="libraries" 
              className="flex-1 md:flex-none text-xs sm:text-sm px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg whitespace-nowrap"
            >
              <Database className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">University Libraries</span>
              <span className="sm:hidden">Libraries</span>
            </TabsTrigger>
            <TabsTrigger 
              value="databases" 
              className="flex-1 md:flex-none text-xs sm:text-sm px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg whitespace-nowrap"
            >
              <Globe className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Research Databases</span>
              <span className="sm:hidden">Databases</span>
            </TabsTrigger>
            <TabsTrigger 
              value="recent" 
              className="flex-1 md:flex-none text-xs sm:text-sm px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg whitespace-nowrap"
            >
              <Clock className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Recent Resources</span>
              <span className="sm:hidden">Recent</span>
            </TabsTrigger>
            <TabsTrigger 
              value="subjects" 
              className="flex-1 md:flex-none text-xs sm:text-sm px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg whitespace-nowrap"
            >
              <BookOpen className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">By Subject</span>
              <span className="sm:hidden">Subjects</span>
            </TabsTrigger>
          </TabsList>

          {/* University Libraries */}
          <TabsContent value="libraries" className="space-y-6">
            {filteredLibraries.length === 0 ? (
              <Card className="bg-gradient-card border-border p-8 text-center">
                <p className="text-muted-foreground">No libraries found matching your filters.</p>
                <Button variant="link" onClick={clearFilters} className="mt-2">
                  Clear filters
                </Button>
              </Card>
            ) : (
            <div className="grid gap-6">
              {filteredLibraries.map((library, index) => (
                <Card key={index} className="bg-gradient-card border-border hover:shadow-card transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-xl">{library.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{library.university}</Badge>
                          <Badge variant="secondary">{library.type}</Badge>
                          <Badge variant={library.access === "Full Access" ? "outline" : "destructive"}>
                            {library.access}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{library.resources}</p>
                        <p className="text-sm text-muted-foreground">Resources</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{library.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {library.subjects.map((subject, i) => (
                        <Badge key={i} variant="outline">{subject}</Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        className="bg-gradient-hero hover:shadow-glow transition-all"
                        onClick={() => window.open(library.url, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Browse Collection
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => window.open(library.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Library
                      </Button>
                      <Button variant="ghost">
                        <Bookmark className="h-4 w-4 mr-2" />
                        Bookmark
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            )}
          </TabsContent>

          {/* Research Databases */}
          <TabsContent value="databases" className="space-y-6">
            {filteredDatabases.length === 0 ? (
              <Card className="bg-gradient-card border-border p-8 text-center">
                <p className="text-muted-foreground">No databases found matching your filters.</p>
                <Button variant="link" onClick={clearFilters} className="mt-2">
                  Clear filters
                </Button>
              </Card>
            ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredDatabases.map((database, index) => (
                <Card key={index} className="bg-gradient-card border-border hover:shadow-card transition-all">
                  <CardHeader>
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{database.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{database.provider}</Badge>
                        <Badge variant="secondary">{database.type}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">{database.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Articles:</span>
                          <span className="font-medium">{database.articles}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Access:</span>
                          <Badge variant={database.access === "Open Access" ? "outline" : "destructive"} className="text-xs">
                            {database.access}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {database.subjects.map((subject, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{subject}</Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-gradient-hero hover:shadow-glow transition-all"
                          onClick={() => window.open(database.url, '_blank')}
                        >
                          <Database className="h-4 w-4 mr-2" />
                          Access Database
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(database.url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            )}
          </TabsContent>

          {/* Recent Resources */}
          <TabsContent value="recent" className="space-y-6">
            <div className="space-y-4">
              {recentResources.map((resource, index) => (
                <Card key={index} className="bg-gradient-card border-border hover:shadow-card transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <h3 className="text-lg font-semibold text-foreground">{resource.title}</h3>
                        <p className="text-muted-foreground">
                          {resource.author} • {resource.journal} ({resource.year})
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{resource.type}</Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-secondary fill-current" />
                            <span className="text-sm text-muted-foreground">{resource.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Download className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{resource.downloads}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" className="bg-gradient-hero hover:shadow-glow transition-all">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* By Subject */}
          <TabsContent value="subjects" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularSubjects.map((subject, index) => (
                <Card key={index} className="bg-gradient-card border-border hover:shadow-card transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground">{subject.name}</h3>
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary">{subject.trend}</p>
                        <p className="text-xs text-muted-foreground">growth</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Resources:</span>
                        <span className="font-medium">{subject.resources}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-gradient-hero hover:shadow-glow transition-all" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Explore Subject
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Libraries;