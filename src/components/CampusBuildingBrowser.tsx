import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, Clock, Phone, Search, MapPin, Navigation } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type CampusBuilding = {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  hours: string | null;
  contact: string | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  university_id: string;
};

type Props = {
  universityCode?: string;
};

const CACHE_KEY = "campus_buildings_cache_v1";

export const CampusBuildingBrowser = ({ universityCode }: Props) => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);

      // Hydrate from cache (offline-first)
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) setBuildings(parsed);
        }
      } catch {}

      let uniId: string | null = null;
      if (universityCode) {
        const { data: uni } = await supabase
          .from("universities")
          .select("id")
          .eq("code", universityCode)
          .maybeSingle();
        uniId = uni?.id ?? null;
      }

      let q = supabase.from("campus_buildings").select("*").order("name");
      if (uniId) q = q.eq("university_id", uniId);
      const { data, error } = await q;
      if (!active) return;
      if (!error && data) {
        setBuildings(data as Building[]);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch {}
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [universityCode]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    buildings.forEach((b) => b.category && set.add(b.category));
    return ["all", ...Array.from(set)];
  }, [buildings]);

  const filtered = useMemo(() => {
    return buildings.filter((b) => {
      const matchesCat = category === "all" || b.category === category;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        (b.description ?? "").toLowerCase().includes(q) ||
        (b.category ?? "").toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [buildings, category, search]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Live Campus Directory
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search buildings, departments, services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={category === c ? "default" : "outline"}
              onClick={() => setCategory(c)}
              className="capitalize"
            >
              {c}
            </Button>
          ))}
        </div>

        {loading && buildings.length === 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              No buildings found. Admins can add campus buildings from the dashboard.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {filtered.map((b) => (
              <Card key={b.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight">{b.name}</h3>
                    {b.category && (
                      <Badge variant="secondary" className="capitalize shrink-0">
                        {b.category}
                      </Badge>
                    )}
                  </div>
                  {b.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {b.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {b.hours && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {b.hours}
                      </span>
                    )}
                    {b.contact && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {b.contact}
                      </span>
                    )}
                  </div>
                  {b.latitude != null && b.longitude != null && (
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs"
                    >
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${b.latitude},${b.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Directions
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CampusBuildingBrowser;
