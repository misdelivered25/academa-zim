import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Play } from 'lucide-react';

interface Tutorial {
  title: string;
  subject: string;
  platform: string;
  url: string;
  description: string;
}

const tutorials: Tutorial[] = [
  {
    title: "Mathematics O-Level Complete Course",
    subject: "Mathematics",
    platform: "Khan Academy",
    url: "https://www.khanacademy.org/math",
    description: "Comprehensive math tutorials covering algebra, geometry, and calculus"
  },
  {
    title: "Physics Fundamentals",
    subject: "Physics",
    platform: "Khan Academy",
    url: "https://www.khanacademy.org/science/physics",
    description: "Complete physics course with experiments and demonstrations"
  },
  {
    title: "Chemistry Basics to Advanced",
    subject: "Chemistry",
    platform: "Khan Academy",
    url: "https://www.khanacademy.org/science/chemistry",
    description: "From periodic table to organic chemistry"
  },
  {
    title: "Biology Complete Course",
    subject: "Biology",
    platform: "Khan Academy",
    url: "https://www.khanacademy.org/science/biology",
    description: "Cell biology, genetics, evolution, and ecology"
  },
  {
    title: "English Language & Literature",
    subject: "English",
    platform: "YouTube",
    url: "https://www.youtube.com/results?search_query=english+literature+gcse",
    description: "Essay writing, comprehension, and literature analysis"
  },
  {
    title: "Computer Science Fundamentals",
    subject: "Computer Science",
    platform: "freeCodeCamp",
    url: "https://www.freecodecamp.org/",
    description: "Programming basics, algorithms, and web development"
  },
  {
    title: "History & Geography",
    subject: "Social Studies",
    platform: "CrashCourse",
    url: "https://www.youtube.com/c/crashcourse",
    description: "World history, geography, and social sciences"
  },
  {
    title: "Business Studies & Economics",
    subject: "Business",
    platform: "YouTube",
    url: "https://www.youtube.com/results?search_query=business+studies+gcse",
    description: "Business concepts, economics, and entrepreneurship"
  }
];

export const VideoTutorials = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5 text-primary" />
          Video Tutorials
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tutorials.map((tutorial, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-sm">{tutorial.title}</h3>
                      <p className="text-xs text-muted-foreground">{tutorial.subject}</p>
                    </div>
                    <Play className="h-4 w-4 text-primary flex-shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground">{tutorial.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                      {tutorial.platform}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(tutorial.url, '_blank')}
                      className="gap-1"
                    >
                      Watch <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
