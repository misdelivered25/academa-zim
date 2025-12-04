import { useEffect, useState, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, InfoWindow } from "@react-google-maps/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Locate, Loader2, Wifi, WifiOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useOfflineMapData } from "@/hooks/useOfflineMapData";
import OfflineCampusMap from "@/components/OfflineCampusMap";

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

export const universitiesData: { [key: string]: UniversityData } = {
  "UZ": {
    name: "University of Zimbabwe",
    center: { lat: -17.7833, lng: 31.0500 },
    buildings: [
      { name: "Main Library", lat: -17.7833, lng: 31.0500, type: "Library", description: "Central academic library" },
      { name: "Science Building", lat: -17.7843, lng: 31.0510, type: "Academic", description: "Science faculty building" },
      { name: "Administration Block", lat: -17.7823, lng: 31.0490, type: "Admin", description: "Main administration" },
      { name: "Student Centre", lat: -17.7838, lng: 31.0505, type: "Student Services", description: "Student activities and services" },
      { name: "Engineering Block", lat: -17.7848, lng: 31.0520, type: "Academic", description: "Engineering faculty" },
      { name: "Medical School", lat: -17.7818, lng: 31.0515, type: "Academic", description: "Faculty of Medicine" },
      { name: "Sports Complex", lat: -17.7858, lng: 31.0530, type: "Sports", description: "Sports facilities and gymnasium" },
    ],
  },
  "NUST": {
    name: "National University of Science and Technology",
    center: { lat: -20.1514, lng: 28.5972 },
    buildings: [
      { name: "Library Complex", lat: -20.1514, lng: 28.5972, type: "Library", description: "Main library" },
      { name: "Faculty of Technology", lat: -20.1524, lng: 28.5982, type: "Academic", description: "Technology building" },
      { name: "ICT Centre", lat: -20.1504, lng: 28.5962, type: "Academic", description: "IT and computer labs" },
      { name: "Sports Complex", lat: -20.1534, lng: 28.5992, type: "Sports", description: "Sports facilities" },
      { name: "Administration", lat: -20.1509, lng: 28.5967, type: "Admin", description: "Main administration building" },
    ],
  },
  "MSU": {
    name: "Midlands State University",
    center: { lat: -19.4503, lng: 29.8156 },
    buildings: [
      { name: "Main Library", lat: -19.4503, lng: 29.8156, type: "Library", description: "Central library" },
      { name: "Faculty of Arts", lat: -19.4513, lng: 29.8166, type: "Academic", description: "Arts faculty" },
      { name: "Commerce Building", lat: -19.4493, lng: 29.8146, type: "Academic", description: "Business and commerce" },
      { name: "Student Center", lat: -19.4508, lng: 29.8161, type: "Student Services", description: "Student services hub" },
    ],
  },
  "CUT": {
    name: "Chinhoyi University of Technology",
    center: { lat: -17.3547, lng: 30.1951 },
    buildings: [
      { name: "Main Library", lat: -17.3547, lng: 30.1951, type: "Library", description: "Central library" },
      { name: "Technology Block", lat: -17.3557, lng: 30.1961, type: "Academic", description: "Technology faculty" },
      { name: "Administration", lat: -17.3537, lng: 30.1941, type: "Admin", description: "Main administration" },
    ],
  },
};

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

// Static libraries array to prevent reloading
const LIBRARIES: ("places")[] = ["places"];

interface GoogleMapCampusProps {
  selectedUniversity: string;
  searchQuery: string;
}

// Inner component that uses the Google Maps hooks
function GoogleMapInner({ 
  selectedUniversity, 
  searchQuery, 
  apiKey 
}: GoogleMapCampusProps & { apiKey: string }) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [travelMode, setTravelMode] = useState<google.maps.TravelMode | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const universityData = universitiesData[selectedUniversity] || universitiesData["UZ"];

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES,
  });

  // Filter buildings based on search query
  const filteredBuildings = universityData.buildings.filter(
    (building) =>
      building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      building.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      building.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setIsLocating(false);
          toast.success("Location found!");
          
          if (mapRef.current) {
            mapRef.current.panTo(location);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
          toast.error("Could not get your location. Please enable GPS.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setIsLocating(false);
      toast.error("Geolocation is not supported by your browser");
    }
  }, []);

  // Calculate directions
  const getDirections = useCallback(
    (destination: Building, mode: google.maps.TravelMode = google.maps.TravelMode.WALKING) => {
      if (!userLocation) {
        toast.error("Please enable GPS to get directions");
        getCurrentLocation();
        return;
      }

      setTravelMode(mode);
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin: userLocation,
          destination: { lat: destination.lat, lng: destination.lng },
          travelMode: mode,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
            setSelectedBuilding(destination);
            toast.success(`Route to ${destination.name} calculated`);
          } else {
            toast.error("Could not calculate directions");
          }
        }
      );
    },
    [userLocation, getCurrentLocation]
  );

  const clearDirections = () => {
    setDirections(null);
    setTravelMode(null);
  };

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const getMarkerIcon = (type: string) => {
    const colors: { [key: string]: string } = {
      Library: "#3B82F6",
      Academic: "#8B5CF6",
      Admin: "#F59E0B",
      "Student Services": "#10B981",
      Sports: "#EF4444",
    };
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: colors[type] || "#6B7280",
      fillOpacity: 1,
      strokeWeight: 2,
      strokeColor: "#FFFFFF",
      scale: 12,
    };
  };

  if (loadError) {
    return (
      <Card className="bg-gradient-card border-border">
        <CardContent className="p-6">
          <div className="h-96 flex items-center justify-center">
            <div className="text-center space-y-4">
              <MapPin className="h-12 w-12 text-destructive mx-auto" />
              <p className="text-destructive">Failed to load Google Maps</p>
              <p className="text-sm text-muted-foreground">Please check your API key configuration</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card className="bg-gradient-card border-border">
        <CardContent className="p-6">
          <div className="h-96 flex items-center justify-center">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
              <p className="text-muted-foreground">Loading Google Maps...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {universityData.name}
            <Badge variant="outline" className="text-xs flex items-center gap-1 text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 ml-2">
              <Wifi className="h-3 w-3" />
              Online
            </Badge>
          </CardTitle>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              disabled={isLocating}
            >
              {isLocating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Locate className="h-4 w-4 mr-2" />
              )}
              My Location
            </Button>
            {directions && (
              <Button variant="outline" size="sm" onClick={clearDirections}>
                Clear Route
              </Button>
            )}
          </div>
        </div>
        {directions && (
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">
              {directions.routes[0]?.legs[0]?.distance?.text}
            </Badge>
            <Badge variant="outline">
              {directions.routes[0]?.legs[0]?.duration?.text}
            </Badge>
            <Badge>
              {travelMode === google.maps.TravelMode.WALKING ? "Walking" : "Driving"}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[450px] rounded-b-lg overflow-hidden">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={universityData.center}
            zoom={16}
            onLoad={onMapLoad}
            options={{
              mapTypeControl: true,
              streetViewControl: true,
              fullscreenControl: true,
              zoomControl: true,
            }}
          >
            {/* User location marker */}
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: "#4285F4",
                  fillOpacity: 1,
                  strokeWeight: 3,
                  strokeColor: "#FFFFFF",
                  scale: 10,
                }}
                title="Your Location"
              />
            )}

            {/* Building markers */}
            {filteredBuildings.map((building, index) => (
              <Marker
                key={index}
                position={{ lat: building.lat, lng: building.lng }}
                icon={getMarkerIcon(building.type)}
                onClick={() => setSelectedBuilding(building)}
                title={building.name}
              />
            ))}

            {/* Info window for selected building */}
            {selectedBuilding && !directions && (
              <InfoWindow
                position={{ lat: selectedBuilding.lat, lng: selectedBuilding.lng }}
                onCloseClick={() => setSelectedBuilding(null)}
              >
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-foreground">{selectedBuilding.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{selectedBuilding.type}</p>
                  <p className="text-xs text-muted-foreground mb-3">{selectedBuilding.description}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => getDirections(selectedBuilding, google.maps.TravelMode.WALKING)}
                      className="text-xs"
                    >
                      <Navigation className="h-3 w-3 mr-1" />
                      Walk
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => getDirections(selectedBuilding, google.maps.TravelMode.DRIVING)}
                      className="text-xs"
                    >
                      Drive
                    </Button>
                  </div>
                </div>
              </InfoWindow>
            )}

            {/* Directions renderer */}
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  polylineOptions: {
                    strokeColor: "#4285F4",
                    strokeWeight: 5,
                  },
                }}
              />
            )}
          </GoogleMap>
        </div>

        {/* Building list */}
        <div className="p-4 border-t border-border">
          <h4 className="font-semibold mb-3 text-foreground">Campus Buildings</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredBuildings.map((building, index) => (
              <Button
                key={index}
                variant="ghost"
                className="justify-start h-auto py-2 px-3"
                onClick={() => {
                  setSelectedBuilding(building);
                  mapRef.current?.panTo({ lat: building.lat, lng: building.lng });
                }}
              >
                <MapPin className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium">{building.name}</p>
                  <p className="text-xs text-muted-foreground">{building.type}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Wrapper component that fetches API key first and handles offline mode
export default function GoogleMapCampus({ selectedUniversity, searchQuery }: GoogleMapCampusProps) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOnline, cacheMapData, getCacheAge, hasCachedData } = useOfflineMapData();

  const universityData = universitiesData[selectedUniversity] || universitiesData["UZ"];

  // Cache university data when online
  useEffect(() => {
    if (isOnline) {
      cacheMapData(universitiesData);
    }
  }, [isOnline, cacheMapData]);

  useEffect(() => {
    const fetchApiKey = async () => {
      // If offline, skip API key fetch and use cached data
      if (!isOnline) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("get-maps-api-key");
        if (error) throw error;
        if (!data.apiKey) throw new Error("No API key returned");
        setApiKey(data.apiKey);
      } catch (err) {
        console.error("Failed to fetch Google Maps API key:", err);
        setError("Failed to load map configuration");
        toast.error("Failed to load map. Please check your Google Maps API key configuration.");
      } finally {
        setLoading(false);
      }
    };
    fetchApiKey();
  }, [isOnline]);

  // Show offline map when not online
  if (!isOnline) {
    return (
      <OfflineCampusMap
        universityData={universityData}
        searchQuery={searchQuery}
        cacheAge={getCacheAge()}
      />
    );
  }

  if (loading) {
    return (
      <Card className="bg-gradient-card border-border">
        <CardContent className="p-6">
          <div className="h-96 flex items-center justify-center">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
              <p className="text-muted-foreground">Loading map configuration...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !apiKey) {
    // If we have cached data and API fails, show offline map
    if (hasCachedData) {
      return (
        <OfflineCampusMap
          universityData={universityData}
          searchQuery={searchQuery}
          cacheAge={getCacheAge()}
        />
      );
    }

    return (
      <Card className="bg-gradient-card border-border">
        <CardContent className="p-6">
          <div className="h-96 flex items-center justify-center">
            <div className="text-center space-y-4">
              <MapPin className="h-12 w-12 text-destructive mx-auto" />
              <p className="text-destructive">{error || "Failed to load map"}</p>
              <p className="text-sm text-muted-foreground">Please configure your Google Maps API key</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <GoogleMapInner 
      selectedUniversity={selectedUniversity} 
      searchQuery={searchQuery} 
      apiKey={apiKey} 
    />
  );
}
