import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, WifiOff, Building, Navigation, Clock } from "lucide-react";

interface Building {
  name: string;
  lat: number;
  lng: number;
  type: string;
  description: string;
}

interface UniversityData {
  name: string;
  center: { lat: number; lng: number };
  buildings: Building[];
}

interface OfflineCampusMapProps {
  universityData: UniversityData;
  searchQuery: string;
  cacheAge: string | null;
}

export default function OfflineCampusMap({ 
  universityData, 
  searchQuery,
  cacheAge 
}: OfflineCampusMapProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  // Filter buildings based on search query
  const filteredBuildings = universityData.buildings.filter(
    (building) =>
      building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      building.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      building.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      Library: "bg-blue-500",
      Academic: "bg-purple-500",
      Admin: "bg-amber-500",
      "Student Services": "bg-emerald-500",
      Sports: "bg-red-500",
    };
    return colors[type] || "bg-gray-500";
  };

  const getTypeBadgeVariant = (type: string): "default" | "secondary" | "outline" | "destructive" => {
    const variants: { [key: string]: "default" | "secondary" | "outline" | "destructive" } = {
      Library: "default",
      Academic: "secondary",
      Admin: "outline",
      "Student Services": "default",
      Sports: "destructive",
    };
    return variants[type] || "outline";
  };

  return (
    <Card className="bg-gradient-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {universityData.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1 text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/30">
              <WifiOff className="h-3 w-3" />
              Offline Mode
            </Badge>
            {cacheAge && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Cached {cacheAge}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Offline Map Visualization */}
        <div className="h-[450px] bg-muted/30 relative overflow-hidden rounded-none border-y border-border">
          {/* Grid Background */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
          
          {/* Campus outline */}
          <div className="absolute inset-4 border-2 border-dashed border-primary/30 rounded-lg" />
          
          {/* Center marker for campus */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-primary/50 rounded-full animate-pulse" />
          </div>

          {/* Building markers positioned relatively */}
          <div className="absolute inset-0 p-8">
            {filteredBuildings.map((building, index) => {
              // Calculate relative position based on lat/lng offset from center
              const latOffset = (building.lat - universityData.center.lat) * 10000;
              const lngOffset = (building.lng - universityData.center.lng) * 10000;
              
              // Normalize to percentage (clamp between 10% and 90%)
              const topPercent = Math.max(10, Math.min(90, 50 - latOffset * 3));
              const leftPercent = Math.max(10, Math.min(90, 50 + lngOffset * 3));

              const isSelected = selectedBuilding?.name === building.name;

              return (
                <button
                  key={index}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                    isSelected ? 'scale-125 z-10' : 'hover:scale-110'
                  }`}
                  style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
                  onClick={() => setSelectedBuilding(isSelected ? null : building)}
                >
                  <div className={`w-8 h-8 rounded-full ${getTypeColor(building.type)} flex items-center justify-center shadow-lg border-2 border-white`}>
                    <Building className="h-4 w-4 text-white" />
                  </div>
                  <span className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs font-medium whitespace-nowrap px-2 py-0.5 rounded bg-background/90 shadow ${
                    isSelected ? 'visible' : 'invisible group-hover:visible'
                  }`}>
                    {building.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected building info overlay */}
          {selectedBuilding && (
            <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-border">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{selectedBuilding.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{selectedBuilding.description}</p>
                  <Badge variant={getTypeBadgeVariant(selectedBuilding.type)}>
                    {selectedBuilding.type}
                  </Badge>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>Lat: {selectedBuilding.lat.toFixed(4)}</p>
                  <p>Lng: {selectedBuilding.lng.toFixed(4)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Offline notice */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-center">
            <div className="bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-sm">
              <WifiOff className="h-4 w-4" />
              <span>You're viewing cached map data. Connect to internet for full features.</span>
            </div>
          </div>
        </div>

        {/* Building list */}
        <div className="p-4 border-t border-border">
          <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
            <Building className="h-4 w-4" />
            Campus Buildings ({filteredBuildings.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredBuildings.map((building, index) => (
              <Button
                key={index}
                variant={selectedBuilding?.name === building.name ? "secondary" : "ghost"}
                className="justify-start h-auto py-2 px-3"
                onClick={() => setSelectedBuilding(
                  selectedBuilding?.name === building.name ? null : building
                )}
              >
                <div className={`w-3 h-3 rounded-full ${getTypeColor(building.type)} mr-2 flex-shrink-0`} />
                <div className="text-left">
                  <p className="text-sm font-medium">{building.name}</p>
                  <p className="text-xs text-muted-foreground">{building.type}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-3 text-xs">
            {["Library", "Academic", "Admin", "Student Services", "Sports"].map((type) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${getTypeColor(type)}`} />
                <span className="text-muted-foreground">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
