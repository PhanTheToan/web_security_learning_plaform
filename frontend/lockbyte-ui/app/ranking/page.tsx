"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import ParticlesComponent from "@/components/particles-background";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, BrainCircuit, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Ranker {
  userId: number;
  fullName: string;
  labsSolved: number;
  totalTimeMinutes: number;
  totalErrors: number;
}

const PodiumCard = ({ ranker, rank }: { ranker: Ranker; rank: number }) => {
  const styles = {
    1: { // Gold
      card: "border-amber-400/80 bg-amber-500/20 shadow-[0_0_30px_rgba(252,211,77,0.4)]",
      trophy: "text-amber-400",
      order: "order-2",
      transform: "scale(1.1) -translate-y-4",
    },
    2: { // Silver
      card: "border-slate-300/80 bg-slate-400/20 shadow-[0_0_25px_rgba(203,213,225,0.3)]",
      trophy: "text-slate-300",
      order: "order-1",
      transform: "scale(1.0)",
    },
    3: { // Bronze
      card: "border-orange-500/80 bg-orange-600/20 shadow-[0_0_20px_rgba(234,88,12,0.3)]",
      trophy: "text-orange-500",
      order: "order-3",
      transform: "scale(1.0)",
    },
  };

  const style = styles[rank as keyof typeof styles];

  return (
    <div className={`flex flex-col items-center ${style.order} ${style.transform} transition-transform duration-300`}>
      <Trophy className={`w-12 h-12 mb-2 ${style.trophy}`} />
      <Card className={`flex flex-col items-center p-6 rounded-xl w-64 text-center ${style.card}`}>
        <Image src="/avatar.png" alt={ranker.fullName} width={80} height={80} className="rounded-full border-4 border-slate-600 mb-4" />
        <p className="text-xl font-bold text-white truncate w-full">{ranker.fullName}</p>
        <div className="flex items-center mt-2 text-lg" title="Labs Solved">
          <BrainCircuit className="w-6 h-6 mr-2 text-purple-400" />
          <span className="font-semibold">{ranker.labsSolved} Labs</span>
        </div>
      </Card>
    </div>
  );
};

export default function RankingPage() {
  const [ranking, setRanking] = useState<Ranker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/top-10`);
        if (!res.ok) throw new Error("Failed to fetch leaderboard data.");
        const data = await res.json();
        setRanking(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, []);

  const top3 = ranking.slice(0, 3);
  const podiumOrder = [2, 1, 3]; // 2nd, 1st, 3rd

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ParticlesComponent id="tsparticles" />
      <Header />
      <main className="relative z-10">
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
              <Trophy className="inline-block w-12 h-12 mr-4 text-yellow-400" />
              Leaderboard
            </h1>
            <p className="mt-4 text-lg text-slate-300">
              See who is leading the charge in solving our cybersecurity challenges.
            </p>
          </div>

          {loading && <Skeleton className="h-64 w-full rounded-xl" />}

          {error && (
            <Card className="bg-red-500/10 border-red-500/30 p-6 text-center text-red-300">
              <AlertTriangle className="mx-auto h-12 w-12" />
              <h2 className="mt-4 text-2xl font-semibold">Error Loading Leaderboard</h2>
              <p className="mt-2">{error}</p>
            </Card>
          )}

          {!loading && !error && top3.length >= 3 && (
            <div className="flex justify-center items-end gap-8 mb-20">
              {podiumOrder.map(rank => {
                  const ranker = top3[rank-1];
                  return <PodiumCard key={ranker.userId} ranker={ranker} rank={rank} />
              })}
            </div>
          )}

          {!loading && !error && (
            <div className="rounded-2xl overflow-hidden border border-[#ffffff]/10 bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-white/10 border-b border-white/10">
                    <TableHead className="text-white font-semibold w-24 text-center">Rank</TableHead>
                    <TableHead className="text-white font-semibold">User</TableHead>
                    <TableHead className="text-white font-semibold text-right">Labs Solved</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ranking.map((ranker, index) => (
                    <TableRow
                      key={ranker.userId}
                      className={`border-b border-white/10 text-white/80 transition-colors ${
                        index % 2 === 0 ? "bg-white/0 hover:bg-white/5" : "bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <TableCell className="py-4 text-center font-bold text-lg">
                        {index < 3 ? <Trophy className={`w-6 h-6 mx-auto ${index === 0 ? 'text-amber-400' : index === 1 ? 'text-slate-300' : 'text-orange-500'}`} /> : index + 1}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center">
                          <Image src="/avatar.png" alt={ranker.fullName} width={40} height={40} className="rounded-full border-2 border-slate-600 mr-4" />
                          <span className="font-medium">{ranker.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-right font-semibold">{ranker.labsSolved}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
