"use client";

import { Youtube, BookText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CommunitySolution {
  id: number;
  status: string;
  writeup: string;
  youtubeUrl: string;
  labId: number;
  userId: number;
  fullName: string;
}

interface CommunitySolutionsProps {
  solutions: CommunitySolution[];
}

const CommunitySolutions = ({ solutions }: CommunitySolutionsProps) => {
  if (!solutions || solutions.length === 0) {
    return <p>No community solutions available yet.</p>;
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {solutions.map((solution) => (
        <Card key={solution.id} className="bg-slate-800/50 border-slate-700 overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-4 p-4 bg-slate-900/30">
            <Avatar>
              <AvatarImage src={`/avatars/${solution.userId}.png`} alt={solution.fullName} />
              <AvatarFallback>{getInitials(solution.fullName)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg text-white">{solution.fullName}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {solution.youtubeUrl && (
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center text-purple-300">
                  <Youtube className="mr-2 h-5 w-5" />
                  YouTube Video
                </h3>
                <div className="rounded-lg overflow-hidden h-[240px] md:h-[400px] lg:h-[500px]">
                  <iframe
                    src={`https://www.youtube.com/embed/${new URL(solution.youtubeUrl).searchParams.get('v')}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            )}
            {solution.writeup && (
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center text-purple-300">
                  <BookText className="mr-2 h-5 w-5" />
                  Write-up
                </h3>
                <Button asChild variant="outline" className="border-purple-400/50 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300">
                  <a href={solution.writeup} target="_blank" rel="noopener noreferrer">
                    Read Write-up
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CommunitySolutions;
