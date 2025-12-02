"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export function UserProfileCard({ user, proficiencyLevel }: { user: { fullName: string; avatarUrl?: string; rank?: string }; proficiencyLevel?: string }) {
  return (
    <Card className="glass-card hover:glass-card-hover transition-all duration-300 rounded-2xl">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-purple-400/40">
          <Image src={user.avatarUrl || "/avatar.png"} alt={user.fullName} fill className="object-cover" />
        </div>
        <div>
          <CardTitle className="text-white">{user.fullName}</CardTitle>
          {proficiencyLevel && (
            <p className="text-sm text-white/70">Proficiency: {proficiencyLevel}</p>
          )}
          {user.rank && (
            <p className="text-lg font-bold text-yellow-400 mt-1">Rank: {user.rank}</p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-white/70 text-sm">Welcome back! Keep hacking — every solved lab boosts your skill graph.</p>
      </CardContent>
    </Card>
  );
}
