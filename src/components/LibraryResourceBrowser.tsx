import { useEffect, useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, ExternalLink, Loader2, Search, ShieldCheck, Unlock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Resource {
  id: string;
  title: string;
  description: string | null;
  url: string;
  resource_type: string | null;
  subject: string | null;
  course_tag: string | null;
  access_type: string | null;
  is_open_access: boolean;
  is_verified: boolean;
  is_broken: boolean;
  thumbnail_url: string | null;
}

export default function LibraryResourceBrowser() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("all");
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [resRes, bmRes] = await Promise.all([
        supabase
          .from("library_resources")
          .select("*")
          .eq("is_broken", false)
          .order("is_verified", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(200),
        user
          ? supabase
              .from("library_bookmarks")
              .select("resource_id")
              .eq("user_id", user.id)
          : Promise.resolve({ data: [] as { resource_id: string }[], error: null }),
      ]);

      if (resRes.error) console.error(resRes.error);
      else setResources((resRes.data || []) as Resource[]);

      if (!("error" in bmRes) || !bmRes.error) {
        setBookmarks(new Set((bmRes.data || []).map((b) => b.resource_id)));
      }
      setLoading(false);
    })();
  }, [user]);

  const toggleBookmark = async (id: string) => {
    if (!user) {
      toast({ title: "Sign in to bookmark", variant: "destructive" });
      return;
    }
    const isBookmarked = bookmarks.has(id);
    const next = new Set(bookmarks);
    if (isBookmarked) {
      next.delete(id);
      setBookmarks(next);
      const { error } = await supabase
        .from("library_bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("resource_id", id);
      if (error) {
        toast({ title: "Failed to remove bookmark", variant: "destructive" });
        next.add(id);
        setBookmarks(new Set(next));
      }
    } else {
      next.add(id);
      setBookmarks(next);
      const { error } = await supabase
        .from("library_bookmarks")
        .insert({ user_id: user.id, resource_id: id });
      if (error) {
        toast({ title: "Failed to bookmark", variant: "destructive" });
        next.delete(id);
        setBookmarks(new Set(next));
      }
    }
  };

  const types = useMemo(() => {
    const s = new Set<string>();
    resources.forEach((r) => r.resource_type && s.add(r.resource_type));
    return Array.from(s).sort();
  }, [resources]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return resources.filter((r) => {
      if (onlyBookmarked && !bookmarks.has(r.id)) return false;
      if (type !== "all" && r.resource_type !== type) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.subject?.toLowerCase().includes(q) ||
        r.course_tag?.toLowerCase().includes(q)
      );
    });
  }, [resources, query, type, onlyBookmarked, bookmarks]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources, courses, subjects..."
            className="pl-9"
          />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full sm:w-44 bg-background">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border z-50">
            <SelectItem value="all">All types</SelectItem>
            {types.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant={onlyBookmarked ? "default" : "outline"}
          onClick={() => setOnlyBookmarked((v) => !v)}
        >
          <Bookmark className="h-4 w-4 mr-2" />
          Saved
        </Button>
      </div>

      {filtered.length === 0 ? (
        <Card className="bg-gradient-card border-border p-8 text-center">
          <p className="text-muted-foreground">
            {resources.length === 0
              ? "No curated resources yet. Check back soon."
              : "No resources match your filters."}
          </p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => {
            const saved = bookmarks.has(r.id);
            return (
              <Card
                key={r.id}
                className="bg-gradient-card border-border p-4 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground line-clamp-2">
                    {r.title}
                  </h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 shrink-0"
                    onClick={() => toggleBookmark(r.id)}
                    aria-label={saved ? "Remove bookmark" : "Bookmark"}
                  >
                    {saved ? (
                      <BookmarkCheck className="h-4 w-4 text-primary" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {r.description && (
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {r.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {r.resource_type && (
                    <Badge variant="secondary" className="text-[10px]">
                      {r.resource_type}
                    </Badge>
                  )}
                  {r.subject && (
                    <Badge variant="outline" className="text-[10px]">
                      {r.subject}
                    </Badge>
                  )}
                  {r.is_open_access && (
                    <Badge className="text-[10px] bg-green-500/15 text-green-400 border-green-500/30">
                      <Unlock className="h-2.5 w-2.5 mr-1" /> Open
                    </Badge>
                  )}
                  {r.is_verified && (
                    <Badge className="text-[10px] bg-primary/15 text-primary border-primary/30">
                      <ShieldCheck className="h-2.5 w-2.5 mr-1" /> Verified
                    </Badge>
                  )}
                </div>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="mt-auto"
                >
                  <a href={r.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5 mr-2" />
                    Open resource
                  </a>
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
