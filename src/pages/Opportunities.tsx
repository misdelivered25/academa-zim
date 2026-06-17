import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import {
  Briefcase,
  GraduationCap,
  Award,
  Search,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Calendar,
  MapPin,
  Building2,
} from "lucide-react";

type Opportunity = {
  id: string;
  title: string;
  description: string | null;
  opportunity_type: string;
  organization: string | null;
  amount: string | null;
  location: string | null;
  deadline: string | null;
  apply_url: string | null;
  contact_email: string | null;
  eligibility: string | null;
  program: string | null;
  is_active: boolean;
};

const TYPES = [
  { value: "all", label: "All", icon: Briefcase },
  { value: "scholarship", label: "Scholarships", icon: GraduationCap },
  { value: "internship", label: "Internships", icon: Briefcase },
  { value: "job", label: "Jobs", icon: Briefcase },
  { value: "grant", label: "Grants", icon: Award },
];

const Opportunities = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Opportunity[]>([]);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [savedOnly, setSavedOnly] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("opportunities")
        .select("*")
        .eq("is_active", true)
        .order("deadline", { ascending: true, nullsFirst: false });
      if (!active) return;
      if (data) setItems(data as Opportunity[]);

      if (user) {
        const { data: bm } = await supabase
          .from("opportunity_bookmarks")
          .select("opportunity_id")
          .eq("user_id", user.id);
        if (bm) setBookmarks(new Set(bm.map((b: any) => b.opportunity_id)));
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [user]);

  const toggleBookmark = async (id: string) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Log in to save opportunities." });
      return;
    }
    const isSaved = bookmarks.has(id);
    const next = new Set(bookmarks);
    if (isSaved) {
      next.delete(id);
      setBookmarks(next);
      await supabase
        .from("opportunity_bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("opportunity_id", id);
    } else {
      next.add(id);
      setBookmarks(next);
      await supabase
        .from("opportunity_bookmarks")
        .insert({ user_id: user.id, opportunity_id: id });
      toast({ title: "Saved", description: "Opportunity bookmarked." });
    }
  };

  const filtered = useMemo(() => {
    return items.filter((o) => {
      if (savedOnly && !bookmarks.has(o.id)) return false;
      if (type !== "all" && o.opportunity_type !== type) return false;
      const q = search.toLowerCase().trim();
      if (!q) return true;
      return (
        o.title.toLowerCase().includes(q) ||
        (o.organization ?? "").toLowerCase().includes(q) ||
        (o.description ?? "").toLowerCase().includes(q) ||
        (o.program ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, search, type, savedOnly, bookmarks]);

  const daysUntil = (deadline: string | null) => {
    if (!deadline) return null;
    const diff = Math.ceil(
      (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Opportunities Hub</h1>
          <p className="text-muted-foreground">
            Scholarships, internships, jobs, and grants curated for Zimbabwean students.
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, organization, program..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => {
              const Icon = t.icon;
              return (
                <Button
                  key={t.value}
                  size="sm"
                  variant={type === t.value ? "default" : "outline"}
                  onClick={() => setType(t.value)}
                >
                  <Icon className="h-3.5 w-3.5 mr-1.5" />
                  {t.label}
                </Button>
              );
            })}
            <Button
              size="sm"
              variant={savedOnly ? "default" : "outline"}
              onClick={() => setSavedOnly((v) => !v)}
            >
              <Bookmark className="h-3.5 w-3.5 mr-1.5" />
              Saved
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium mb-1">No opportunities found</p>
              <p className="text-sm">
                {savedOnly
                  ? "You haven't bookmarked any opportunities yet."
                  : "Check back soon — admins add new listings regularly."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((o) => {
              const days = daysUntil(o.deadline);
              const saved = bookmarks.has(o.id);
              return (
                <Card key={o.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <CardTitle className="text-base leading-tight">
                          {o.title}
                        </CardTitle>
                        {o.organization && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {o.organization}
                          </p>
                        )}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 shrink-0"
                        onClick={() => toggleBookmark(o.id)}
                      >
                        {saved ? (
                          <BookmarkCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <Badge variant="secondary" className="capitalize">
                        {o.opportunity_type}
                      </Badge>
                      {o.amount && <Badge variant="outline">{o.amount}</Badge>}
                      {days !== null && days >= 0 && (
                        <Badge variant={days <= 7 ? "destructive" : "outline"}>
                          {days === 0 ? "Closes today" : `${days}d left`}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    {o.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {o.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {o.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {o.location}
                        </span>
                      )}
                      {o.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(o.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {o.apply_url && (
                      <Button asChild size="sm" className="w-full">
                        <a href={o.apply_url} target="_blank" rel="noreferrer">
                          Apply
                          <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Opportunities;
