import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Search, 
  Navigation, 
  Clock, 
  Phone, 
  Building,
  Users,
  Car,
  Bus,
  Utensils,
  BookOpen,
  AlertTriangle
} from "lucide-react";
import Header from "@/components/Header";
import GoogleMapCampus from "@/components/GoogleMapCampus";
import CampusBuildingBrowser from "@/components/CampusBuildingBrowser";

// University-specific data
const universityData: Record<string, {
  name: string;
  location: string;
  campusLocations: Array<{
    name: string;
    type: string;
    building: string;
    floor: string;
    hours: string;
    phone: string;
    services: string[];
    capacity: string;
    description: string;
  }>;
  transportOptions: Array<{
    type: string;
    route: string;
    schedule: string;
    cost: string;
    hours: string;
    icon: typeof Bus;
  }>;
  emergencyContacts: Array<{
    service: string;
    number: string;
    type: string;
    hours: string;
  }>;
}> = {
  UZ: {
    name: "University of Zimbabwe",
    location: "Harare",
    campusLocations: [
      {
        name: "Main Library",
        type: "Library",
        building: "Central Block",
        floor: "Ground Floor",
        hours: "7:00 AM - 10:00 PM",
        phone: "+263 24 230 3211",
        services: ["Study Spaces", "Computer Lab", "Printing", "WiFi"],
        capacity: "500 students",
        description: "The largest library on campus with extensive collection of books and digital resources."
      },
      {
        name: "Computer Science Department",
        type: "Academic",
        building: "Technology Block",
        floor: "3rd Floor",
        hours: "8:00 AM - 5:00 PM",
        phone: "+263 24 230 3245",
        services: ["Computer Labs", "WiFi", "Printing", "Study Rooms"],
        capacity: "200 students",
        description: "Home to computer science courses with state-of-the-art computing facilities."
      },
      {
        name: "Student Cafeteria",
        type: "Dining",
        building: "Student Center",
        floor: "Ground Floor",
        hours: "6:00 AM - 8:00 PM",
        phone: "+263 24 230 3267",
        services: ["Meals", "Coffee", "WiFi", "Seating Area"],
        capacity: "300 students",
        description: "Main dining facility offering affordable meals and refreshments for students."
      },
      {
        name: "Medical Center",
        type: "Health",
        building: "Health Block",
        floor: "Ground Floor",
        hours: "24/7 Emergency",
        phone: "+263 24 230 3289",
        services: ["Medical Care", "First Aid", "Counseling", "Pharmacy"],
        capacity: "50 patients",
        description: "On-campus medical facility providing healthcare services to students and staff."
      }
    ],
    transportOptions: [
      {
        type: "University Shuttle",
        route: "Main Gate - Library - Hostels",
        schedule: "Every 15 minutes",
        cost: "Free",
        hours: "6:00 AM - 10:00 PM",
        icon: Bus
      },
      {
        type: "City Bus (ZUPCO)",
        route: "Campus - City Center (Fourth Street)",
        schedule: "Every 20 minutes",
        cost: "$0.50 USD",
        hours: "5:30 AM - 9:00 PM",
        icon: Bus
      },
      {
        type: "Parking Areas",
        route: "Various locations on campus",
        schedule: "24/7 Access",
        cost: "$2/day",
        hours: "Always available",
        icon: Car
      }
    ],
    emergencyContacts: [
      { service: "Campus Security", number: "+263 24 230 3300", type: "Emergency", hours: "24/7" },
      { service: "Medical Emergency", number: "+263 24 230 3289", type: "Health", hours: "24/7" },
      { service: "Student Services", number: "+263 24 230 3250", type: "Support", hours: "8:00 AM - 5:00 PM" },
      { service: "IT Helpdesk", number: "+263 24 230 3275", type: "Technical", hours: "8:00 AM - 8:00 PM" }
    ]
  },
  NUST: {
    name: "National University of Science and Technology",
    location: "Bulawayo",
    campusLocations: [
      {
        name: "NUST Library",
        type: "Library",
        building: "Library Complex",
        floor: "Ground & 1st Floor",
        hours: "7:30 AM - 9:00 PM",
        phone: "+263 29 228 2842",
        services: ["E-Resources", "Study Pods", "Computer Lab", "WiFi"],
        capacity: "600 students",
        description: "Modern library with extensive electronic resources and quiet study spaces."
      },
      {
        name: "Faculty of Industrial Technology",
        type: "Academic",
        building: "FIT Building",
        floor: "All Floors",
        hours: "8:00 AM - 5:00 PM",
        phone: "+263 29 228 2890",
        services: ["Labs", "Workshops", "WiFi", "Lecture Halls"],
        capacity: "400 students",
        description: "Engineering and technology faculty with practical workshops and labs."
      },
      {
        name: "NUST Cafeteria",
        type: "Dining",
        building: "Student Union Building",
        floor: "Ground Floor",
        hours: "6:30 AM - 7:30 PM",
        phone: "+263 29 228 2860",
        services: ["Meals", "Snacks", "WiFi", "Outdoor Seating"],
        capacity: "350 students",
        description: "Central dining facility with variety of local and international cuisine."
      },
      {
        name: "University Clinic",
        type: "Health",
        building: "Health Services Building",
        floor: "Ground Floor",
        hours: "24/7 Emergency",
        phone: "+263 29 228 2880",
        services: ["Medical Care", "First Aid", "Mental Health", "Pharmacy"],
        capacity: "40 patients",
        description: "Full-service clinic providing comprehensive healthcare to NUST community."
      }
    ],
    transportOptions: [
      {
        type: "Campus Shuttle",
        route: "Main Gate - Academic Blocks - Hostels",
        schedule: "Every 20 minutes",
        cost: "Free",
        hours: "6:30 AM - 9:00 PM",
        icon: Bus
      },
      {
        type: "ZUPCO Bus",
        route: "Campus - Bulawayo CBD",
        schedule: "Every 25 minutes",
        cost: "$0.50 USD",
        hours: "5:00 AM - 8:00 PM",
        icon: Bus
      },
      {
        type: "Student Parking",
        route: "Designated parking lots",
        schedule: "24/7 Access",
        cost: "$1.50/day",
        hours: "Always available",
        icon: Car
      }
    ],
    emergencyContacts: [
      { service: "Security Control Room", number: "+263 29 228 2842", type: "Emergency", hours: "24/7" },
      { service: "University Clinic", number: "+263 29 228 2880", type: "Health", hours: "24/7" },
      { service: "Dean of Students", number: "+263 29 228 2800", type: "Support", hours: "8:00 AM - 4:30 PM" },
      { service: "ICT Helpdesk", number: "+263 29 228 2855", type: "Technical", hours: "8:00 AM - 5:00 PM" }
    ]
  },
  MSU: {
    name: "Midlands State University",
    location: "Gweru",
    campusLocations: [
      {
        name: "MSU Main Library",
        type: "Library",
        building: "Library Building",
        floor: "Ground to 3rd Floor",
        hours: "7:00 AM - 10:00 PM",
        phone: "+263 54 226 0464",
        services: ["Research Resources", "Computer Lab", "Group Study", "WiFi"],
        capacity: "700 students",
        description: "Multi-floor library with comprehensive academic resources and research facilities."
      },
      {
        name: "Faculty of Commerce",
        type: "Academic",
        building: "Commerce Block",
        floor: "All Floors",
        hours: "8:00 AM - 5:00 PM",
        phone: "+263 54 226 0470",
        services: ["Computer Labs", "Tutorial Rooms", "WiFi", "Auditorium"],
        capacity: "500 students",
        description: "Business and commerce faculty with modern teaching facilities."
      },
      {
        name: "Main Dining Hall",
        type: "Dining",
        building: "Dining Complex",
        floor: "Ground Floor",
        hours: "6:00 AM - 8:00 PM",
        phone: "+263 54 226 0455",
        services: ["Breakfast", "Lunch", "Dinner", "Takeaway"],
        capacity: "400 students",
        description: "Large dining facility serving the entire campus community."
      },
      {
        name: "Health Center",
        type: "Health",
        building: "Clinic Building",
        floor: "Ground Floor",
        hours: "24/7 Emergency",
        phone: "+263 54 226 0480",
        services: ["General Medicine", "First Aid", "Counseling", "Referrals"],
        capacity: "30 patients",
        description: "Campus health facility with emergency and general medical services."
      }
    ],
    transportOptions: [
      {
        type: "Campus Bus",
        route: "Main Campus - City Campus - Hostels",
        schedule: "Every 30 minutes",
        cost: "Free",
        hours: "6:00 AM - 8:00 PM",
        icon: Bus
      },
      {
        type: "Gweru Kombis",
        route: "Campus - Gweru Town Center",
        schedule: "Frequent",
        cost: "$0.30 USD",
        hours: "5:30 AM - 7:00 PM",
        icon: Bus
      },
      {
        type: "Parking Facilities",
        route: "Multiple parking areas",
        schedule: "24/7 Access",
        cost: "$1/day",
        hours: "Always available",
        icon: Car
      }
    ],
    emergencyContacts: [
      { service: "Campus Security", number: "+263 54 226 0450", type: "Emergency", hours: "24/7" },
      { service: "Health Center", number: "+263 54 226 0480", type: "Health", hours: "24/7" },
      { service: "Student Affairs", number: "+263 54 226 0460", type: "Support", hours: "8:00 AM - 4:30 PM" },
      { service: "IT Support", number: "+263 54 226 0490", type: "Technical", hours: "8:00 AM - 5:00 PM" }
    ]
  },
  CUT: {
    name: "Chinhoyi University of Technology",
    location: "Chinhoyi",
    campusLocations: [
      {
        name: "CUT Library",
        type: "Library",
        building: "Central Library",
        floor: "Ground & 1st Floor",
        hours: "7:30 AM - 9:00 PM",
        phone: "+263 67 222 3032",
        services: ["Digital Library", "Reading Rooms", "Computer Lab", "WiFi"],
        capacity: "400 students",
        description: "Technology-focused library with extensive digital resources."
      },
      {
        name: "School of Engineering",
        type: "Academic",
        building: "Engineering Block",
        floor: "All Floors",
        hours: "8:00 AM - 5:00 PM",
        phone: "+263 67 222 3040",
        services: ["Engineering Labs", "Workshops", "CAD Lab", "WiFi"],
        capacity: "300 students",
        description: "Engineering school with practical labs and workshop facilities."
      },
      {
        name: "Student Cafeteria",
        type: "Dining",
        building: "Student Services Building",
        floor: "Ground Floor",
        hours: "6:30 AM - 7:00 PM",
        phone: "+263 67 222 3055",
        services: ["Meals", "Beverages", "Snacks", "WiFi"],
        capacity: "250 students",
        description: "Main campus eatery offering affordable student meals."
      },
      {
        name: "University Clinic",
        type: "Health",
        building: "Health Services",
        floor: "Ground Floor",
        hours: "24/7 Emergency",
        phone: "+263 67 222 3060",
        services: ["Primary Care", "First Aid", "Referrals", "Counseling"],
        capacity: "25 patients",
        description: "On-campus clinic providing basic healthcare services."
      }
    ],
    transportOptions: [
      {
        type: "Campus Shuttle",
        route: "Main Gate - Academic Buildings - Hostels",
        schedule: "Every 25 minutes",
        cost: "Free",
        hours: "6:30 AM - 8:00 PM",
        icon: Bus
      },
      {
        type: "Local Transport",
        route: "Campus - Chinhoyi Town",
        schedule: "Regular intervals",
        cost: "$0.30 USD",
        hours: "6:00 AM - 6:00 PM",
        icon: Bus
      },
      {
        type: "Parking Lots",
        route: "Designated areas",
        schedule: "24/7 Access",
        cost: "$1/day",
        hours: "Always available",
        icon: Car
      }
    ],
    emergencyContacts: [
      { service: "Security Office", number: "+263 67 222 3020", type: "Emergency", hours: "24/7" },
      { service: "University Clinic", number: "+263 67 222 3060", type: "Health", hours: "24/7" },
      { service: "Student Services", number: "+263 67 222 3050", type: "Support", hours: "8:00 AM - 4:30 PM" },
      { service: "ICT Department", number: "+263 67 222 3070", type: "Technical", hours: "8:00 AM - 5:00 PM" }
    ]
  }
};

const universities = [
  { code: "UZ", name: "University of Zimbabwe", location: "Harare" },
  { code: "NUST", name: "National University of Science and Technology", location: "Bulawayo" },
  { code: "MSU", name: "Midlands State University", location: "Gweru" },
  { code: "CUT", name: "Chinhoyi University of Technology", location: "Chinhoyi" }
];

const Campus = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("UZ");

  const currentUniData = universityData[selectedUniversity];

  const getLocationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "library": return BookOpen;
      case "academic": return Building;
      case "dining": return Utensils;
      case "health": return Users;
      default: return MapPin;
    }
  };

  const getLocationColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "library": return "default";
      case "academic": return "secondary";
      case "dining": return "outline";
      case "health": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Campus Navigation</h1>
          <p className="text-muted-foreground">
            Find your way around {currentUniData.name} with interactive maps, directions, and location information
          </p>
        </div>

        {/* University Selector and Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <select 
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="flex h-10 w-full md:w-64 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {universities.map((uni) => (
                <option key={uni.code} value={uni.code}>{uni.name}</option>
              ))}
            </select>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for buildings, departments, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="bg-gradient-hero hover:shadow-glow transition-all">
              <Navigation className="h-4 w-4 mr-2" />
              Get Directions
            </Button>
          </div>
        </div>

        {/* Interactive Google Map */}
        <div className="mb-8">
          <GoogleMapCampus 
            selectedUniversity={selectedUniversity} 
            searchQuery={searchQuery} 
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="directory" className="space-y-6">
          <TabsList className="flex flex-wrap justify-start gap-1 h-auto p-1 bg-card/50 border border-border/30 rounded-xl w-full md:w-fit">
            <TabsTrigger
              value="directory"
              className="flex-1 md:flex-none text-xs sm:text-sm px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg whitespace-nowrap"
            >
              <Building className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Live Directory</span>
              <span className="sm:hidden">Directory</span>
            </TabsTrigger>
            <TabsTrigger 
              value="locations" 
              className="flex-1 md:flex-none text-xs sm:text-sm px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg whitespace-nowrap"
            >
              <MapPin className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Campus Locations</span>
              <span className="sm:hidden">Locations</span>
            </TabsTrigger>
            <TabsTrigger 
              value="transport" 
              className="flex-1 md:flex-none text-xs sm:text-sm px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg whitespace-nowrap"
            >
              <Bus className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Transportation</span>
              <span className="sm:hidden">Transport</span>
            </TabsTrigger>
            <TabsTrigger 
              value="emergency" 
              className="flex-1 md:flex-none text-xs sm:text-sm px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg whitespace-nowrap"
            >
              <AlertTriangle className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Emergency Info</span>
              <span className="sm:hidden">Emergency</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="directory" className="space-y-6">
            <CampusBuildingBrowser universityCode={selectedUniversity} />
          </TabsContent>


          {/* Campus Locations */}
          <TabsContent value="locations" className="space-y-6">
            <div className="grid gap-6">
              {currentUniData.campusLocations.map((location, index) => {
                const IconComponent = getLocationIcon(location.type);
                return (
                  <Card key={index} className="bg-gradient-card border-border hover:shadow-card transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-lg ${
                            location.type === "Library" ? 'bg-primary/10' : 
                            location.type === "Academic" ? 'bg-secondary/10' : 
                            location.type === "Dining" ? 'bg-accent/20' : 'bg-destructive/10'
                          }`}>
                            <IconComponent className={`h-6 w-6 ${
                              location.type === "Library" ? 'text-primary' : 
                              location.type === "Academic" ? 'text-secondary' : 
                              location.type === "Dining" ? 'text-accent-foreground' : 'text-destructive'
                            }`} />
                          </div>
                          <div className="space-y-2">
                            <CardTitle className="text-xl">{location.name}</CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge variant={getLocationColor(location.type)}>{location.type}</Badge>
                              <Badge variant="outline">{location.building}</Badge>
                            </div>
                            <p className="text-muted-foreground">{location.description}</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{location.building}, {location.floor}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{location.hours}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{location.phone}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Capacity: {location.capacity}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {location.services.map((service, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{service}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="bg-gradient-hero hover:shadow-glow transition-all">
                          <Navigation className="h-4 w-4 mr-2" />
                          Get Directions
                        </Button>
                        <Button variant="outline">
                          <MapPin className="h-4 w-4 mr-2" />
                          View on Map
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Transportation */}
          <TabsContent value="transport" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentUniData.transportOptions.map((transport, index) => {
                const IconComponent = transport.icon;
                return (
                  <Card key={index} className="bg-gradient-card border-border hover:shadow-card transition-all">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 rounded-lg p-2">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{transport.type}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Route</p>
                          <p className="font-medium">{transport.route}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Schedule</p>
                            <p className="font-medium">{transport.schedule}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Cost</p>
                            <p className="font-medium">{transport.cost}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Hours</p>
                          <p className="text-sm font-medium">{transport.hours}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Emergency Information */}
          <TabsContent value="emergency" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {currentUniData.emergencyContacts.map((contact, index) => (
                <Card key={index} className="bg-gradient-card border-border hover:shadow-card transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground">{contact.service}</h3>
                      <Badge variant={contact.type === "Emergency" ? "destructive" : "secondary"}>
                        {contact.type}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-lg font-mono">{contact.number}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{contact.hours}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4 bg-gradient-hero hover:shadow-glow transition-all" 
                      size="sm"
                      onClick={() => window.location.href = `tel:${contact.number.replace(/\s/g, '')}`}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Emergency Procedures */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="text-xl text-destructive">Emergency Procedures - {currentUniData.name}</CardTitle>
                <CardDescription>
                  Important safety information for campus emergencies at {currentUniData.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">In Case of Fire:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Activate the nearest fire alarm</li>
                      <li>• Evacuate immediately using the nearest exit</li>
                      <li>• Do not use elevators</li>
                      <li>• Call Campus Security: {currentUniData.emergencyContacts[0].number}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Medical Emergency:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Call Medical Emergency: {currentUniData.emergencyContacts[1].number}</li>
                      <li>• Provide exact location on campus</li>
                      <li>• Stay with the person if safe to do so</li>
                      <li>• Follow dispatcher's instructions</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Security Concerns:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Contact Campus Security immediately</li>
                      <li>• Move to a safe location</li>
                      <li>• Provide detailed description of the situation</li>
                      <li>• Follow security personnel instructions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Campus;
