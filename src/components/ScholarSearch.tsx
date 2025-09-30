import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ExternalLink, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SearchResult {
  title: string;
  authors: string;
  year: string;
  snippet: string;
  url: string;
}

export const ScholarSearch = () => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!query.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    // Open Google Scholar with the search query
    const scholarUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;
    window.open(scholarUrl, '_blank');
    
    toast({
      title: "Search Opened",
      description: "Google Scholar opened in a new tab",
    });
  };

  const quickSearches = [
    "Zimbabwean education system",
    "Cambridge O-Level syllabus",
    "ZIMSEC past papers",
    "African history research",
    "Southern Africa economics"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Google Scholar Research
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search academic papers and articles..."
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={searching}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Quick searches:</p>
          <div className="flex flex-wrap gap-2">
            {quickSearches.map((search, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery(search);
                  const scholarUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(search)}`;
                  window.open(scholarUrl, '_blank');
                }}
                className="text-xs"
              >
                {search}
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-muted p-4 rounded-lg space-y-2">
          <h4 className="font-semibold text-sm">Research Tips:</h4>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• Use quotation marks for exact phrases</li>
            <li>• Add author names to find specific papers</li>
            <li>• Use site:edu to search educational institutions</li>
            <li>• Filter by year range for recent research</li>
            <li>• Check "Cited by" to find related papers</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
