import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Building {
  name: string;
  lat: number;
  lng: number;
  type: string;
  description: string;
}

const campusBuildings: { [key: string]: Building[] } = {
  "University of Zimbabwe": [
    { name: "Main Library", lat: -17.7833, lng: 31.0500, type: "Library", description: "Central academic library" },
    { name: "Science Building", lat: -17.7843, lng: 31.0510, type: "Academic", description: "Science faculty building" },
    { name: "Administration Block", lat: -17.7823, lng: 31.0490, type: "Admin", description: "Main administration" },
    { name: "Student Centre", lat: -17.7838, lng: 31.0505, type: "Student Services", description: "Student activities and services" },
    { name: "Engineering Block", lat: -17.7848, lng: 31.0520, type: "Academic", description: "Engineering faculty" },
  ],
  "NUST": [
    { name: "Library Complex", lat: -20.1514, lng: 28.5972, type: "Library", description: "Main library" },
    { name: "Faculty of Technology", lat: -20.1524, lng: 28.5982, type: "Academic", description: "Technology building" },
    { name: "ICT Centre", lat: -20.1504, lng: 28.5962, type: "Academic", description: "IT and computer labs" },
    { name: "Sports Complex", lat: -20.1534, lng: 28.5992, type: "Sports", description: "Sports facilities" },
  ],
  "Midlands State University": [
    { name: "Main Library", lat: -19.4503, lng: 29.8156, type: "Library", description: "Central library" },
    { name: "Faculty of Arts", lat: -19.4513, lng: 29.8166, type: "Academic", description: "Arts faculty" },
    { name: "Commerce Building", lat: -19.4493, lng: 29.8146, type: "Academic", description: "Business and commerce" },
  ],
};

export default function CampusMap() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedUniversity, setSelectedUniversity] = useState("University of Zimbabwe");
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    if (!mapRef.current) {
      const buildings = campusBuildings[selectedUniversity];
      const centerBuilding = buildings[0];

      mapRef.current = L.map(mapContainerRef.current).setView([centerBuilding.lat, centerBuilding.lng], 16);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for buildings
    const buildings = campusBuildings[selectedUniversity];
    buildings.forEach((building) => {
      const marker = L.marker([building.lat, building.lng])
        .addTo(mapRef.current!)
        .bindPopup(`
          <div class="text-sm">
            <h3 class="font-bold">${building.name}</h3>
            <p class="text-muted-foreground">${building.type}</p>
            <p class="text-xs mt-1">${building.description}</p>
          </div>
        `);
      markersRef.current.push(marker);
    });

    // Recenter map
    if (buildings.length > 0) {
      mapRef.current.setView([buildings[0].lat, buildings[0].lng], 16);
    }

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [selectedUniversity]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Campus Map
        </CardTitle>
        <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(campusBuildings).map((uni) => (
              <SelectItem key={uni} value={uni}>
                {uni}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div ref={mapContainerRef} className="h-[500px] rounded-lg border" />
        <div className="mt-4 space-y-2">
          <h4 className="font-semibold">Buildings:</h4>
          {campusBuildings[selectedUniversity].map((building) => (
            <div key={building.name} className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 mt-0.5 text-primary" />
              <div>
                <span className="font-medium">{building.name}</span>
                <span className="text-muted-foreground"> - {building.description}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}