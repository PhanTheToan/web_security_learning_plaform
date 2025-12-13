"use client";

import { Youtube, BookText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CommunitySolution {
  id: number;
  status: string;
  writeup?: string | null;
  youtubeUrl?: string | null;
  labId: number;
  userId: number;
  fullName?: string | null;
}

interface CommunitySolutionsProps {
  solutions?: CommunitySolution[];
}

const getInitials = (name?: string | null) => {
  const s = (name ?? "").trim();
  if (!s) return "??";
  const parts = s.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const getYouTubeId = (url?: string | null): string | null => {
  if (!url) return null;
  const u = url.trim();

  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{6,})/,
    /[?&]v=([A-Za-z0-9_-]{6,})/,
    /embed\/([A-Za-z0-9_-]{6,})/,
    /shorts\/([A-Za-z0-9_-]{6,})/,
    /^([A-Za-z0-9_-]{6,})$/, // plain ID
  ];
  for (const p of patterns) {
    const m = u.match(p);
    if (m) return m[1];
  }
  try {
    const parsed = new URL(u);
    const v = parsed.searchParams.get("v");
    if (v) return v;
  } catch {
  }
  return null;
};

const CommunitySolutions = ({ solutions }: CommunitySolutionsProps) => {
  if (!solutions || solutions.length === 0) {
    return <p>No community solutions available yet.</p>;
  }

  return (
    <div className="space-y-6">
      {solutions.map((solution) => {
        const name = solution.fullName ?? "Anonymous";
        const initials = getInitials(solution.fullName);
        const youtubeId = getYouTubeId(solution.youtubeUrl);
        const hasWriteup = !!solution.writeup;

        return (
          <Card
            key={solution.id}
            className="bg-slate-800/50 border-slate-700 overflow-hidden"
          >
            <CardHeader className="flex flex-row items-center gap-4 p-4 bg-slate-900/30">
              <Avatar>
                <AvatarImage
                  src={`/avatars/${solution.userId}.png`}
                  alt={name}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg text-white">{name}</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {youtubeId && (
                <div>
                  <h3 className="text-md font-semibold mb-2 flex items-center text-purple-300">
                    <Youtube className="mr-2 h-5 w-5" />
                    YouTube Video
                  </h3>
                  <div className="rounded-lg overflow-hidden h-[240px] md:h-[400px] lg:h-[500px]">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      title="YouTube video player"
                      frameBorder={0}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}

              {hasWriteup && (
                <div>
                  <h3 className="text-md font-semibold mb-2 flex items-center text-purple-300">
                    <BookText className="mr-2 h-5 w-5" />
                    Write-up
                  </h3>
                  <Button
                    asChild
                    variant="outline"
                    className="border-purple-400/50 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300"
                  >
                    <a
                      href={solution.writeup as string}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read Write-up
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CommunitySolutions;
