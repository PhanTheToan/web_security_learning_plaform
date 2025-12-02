"use client";

import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserProfileCard } from "@/components/dashboard/user-profile-card";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { CommunitySolutionsTab } from "@/components/dashboard/community-solutions-tab";
import { UserSolvedSection } from "@/components/dashboard/user-solved-section";
import { useAuth } from "@/contexts/AuthContext";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL as string;

// --- Type definitions
interface DashboardData {
  fullName?: string;
  totalEasy: number;
  totalMedium: number;
  totalHard: number;
  totalInsane: number;
  totalSolvedEasy: number;
  totalSolvedMedium: number;
  totalSolvedHard: number;
  totalSolvedInsane: number;
  percentSolved: number;
  proficiencyLevel?: string;
  // Keep these from the original interface if they are still used elsewhere
  solvedCount: number;
  totalPoints: number;
  ranking: number;
  monthlySolvedCounts: { month: string; count: number }[];
  userActivity: { date: string; solvedCount: number; errorCount: number }[];
}

interface CommunitySolution {
  id: number;
  labId: number;
  labName: string;
  youtubeUrl?: string;
  writeUpLink?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string; // ISO date string
}

interface SolvedLab {
  labId: number;
  labName: string;
  difficulty: string;
  completedAt: string; // ISO date string
  errorCount: number;
}


// --- Shared theme classes (không đổi layout, chỉ style)
const cardShell =
  "bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 " +
  "border border-[#ffffff]/10 rounded-2xl backdrop-blur-sm " +
  "hover:border-[#9747ff]/40 transition-all duration-300 shadow-[0_0_15px_rgba(151,71,255,0.15)]";

const tabListShell =
  "grid w-full grid-cols-2 rounded-2xl " +
  "bg-[#ffffff]/5 border border-[#ffffff]/15";

const tabTrigger =
  "rounded-2xl text-white/80 " +
  "data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#9747ff]/20 data-[state=active]:to-[#5a5bed]/10 " +
  "data-[state=active]:text-white " +
  "hover:bg-white/10 transition-colors";

const sectionTitle = "mb-4 text-2xl font-bold text-white";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [communitySolutions, setCommunitySolutions] = useState<CommunitySolution[]>([]);
  const [solvedLabs, setSolvedLabs] = useState<SolvedLab[]>([]);
  const [loading, setLoading] = useState(true);
  const [labsLoading, setLabsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { user } = useAuth();

  // Load dashboard + community solutions
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        if (!apiBaseUrl) throw new Error("Missing NEXT_PUBLIC_API_URL");
        const [dashboardRes, solutionsRes] = await Promise.all([
          fetch(`${apiBaseUrl}/user/dashboard`, { credentials: "include", cache: "no-store" }),
          fetch(`${apiBaseUrl}/lab/community-solutions/user`, { credentials: "include", cache: "no-store" }),
        ]);

        if (!dashboardRes.ok) throw new Error("Failed to fetch /user/dashboard");
        if (!solutionsRes.ok) throw new Error("Failed to fetch /lab/community-solutions/user");

        const dashboardJson = await dashboardRes.json();
        const solutionsJson = await solutionsRes.json();

        setDashboardData(dashboardJson?.body ?? dashboardJson);
        setCommunitySolutions(Array.isArray(solutionsJson?.body) ? solutionsJson.body : []);
      } catch (e: unknown) {
        console.error(e);
        setDashboardData(null);
        setCommunitySolutions([]);
        setErrorMsg(e instanceof Error ? e.message : "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Load solved labs (biểu đồ & bảng)
  useEffect(() => {
    const loadLabs = async () => {
      setLabsLoading(true);
      try {
        if (!apiBaseUrl) throw new Error("Missing NEXT_PUBLIC_API_URL");
        const res = await fetch(`${apiBaseUrl}/user/labs`, {
          credentials: "include",
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch /user/labs");

        const json = await res.json();
        const raw = Array.isArray(json) ? json : (json?.body ?? []);
        const normalized: SolvedLab[] = raw.map((x: Record<string, unknown>) => ({
          labId: x.labId as number,
          labName: (x.labName ?? x.name ?? x.title ?? "Unknown") as string,
          difficulty: (x.difficulty ?? "Unknown") as string,
          completedAt: x.completedAt as string, // ISO
          errorCount: Number.isFinite(x.errorCount) ? (x.errorCount as number) : Number(x.errorCount ?? 0),
        }));
        setSolvedLabs(normalized);
      } catch (e: unknown) {
        console.error(e);
        setSolvedLabs([]);
        setErrorMsg(e instanceof Error ? e.message : "Failed to load solved labs.");
      } finally {
        setLabsLoading(false);
      }
    };
    loadLabs();
  }, []);

  const userForCard = useMemo(
    () => ({
      fullName: dashboardData?.fullName ?? "User",
      avatarUrl: "/avatar.png",
      rank: user?.rank,
    }),
    [dashboardData, user]
  );

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <main className="container mx-auto flex-1 px-4 py-6 md:px-8">
        <div className="space-y-8">
          {errorMsg && (
            <div className="rounded-md border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-300">
              {errorMsg}
            </div>
          )}

          {/* User Info */}
          <section>
            {loading ? (
              <Card className={cardShell}>
                <CardHeader className="flex flex-row items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full bg-white/10" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-[250px] rounded-lg bg-white/10" />
                    <Skeleton className="h-4 w-[200px] rounded-lg bg-white/10" />
                  </div>
                </CardHeader>
              </Card>
            ) : (
              <div className="text-white">
                <UserProfileCard user={userForCard} proficiencyLevel={dashboardData?.proficiencyLevel} />
              </div>
            )}
          </section>

          {/* Dashboard Stats */}
          <section>
            <h2 className={sectionTitle}>Dashboard</h2>
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-[140px] w-full rounded-2xl bg-gradient-to-br from-white/5 to-white/10" />
                <Skeleton className="h-[140px] w-full rounded-2xl bg-gradient-to-br from-white/5 to-white/10" />
                <Skeleton className="h-[140px] w-full rounded-2xl bg-gradient-to-br from-white/5 to-white/10" />
                <Skeleton className="h-[140px] w-full rounded-2xl bg-gradient-to-br from-white/5 to-white/10" />
              </div>
            ) : dashboardData ? (
              <div className="text-white">
                <DashboardStats data={dashboardData} />
              </div>
            ) : null}
          </section>

          {/* Tabs */}
          <section>
            <Tabs defaultValue="solved" className="text-white">
              <TabsList className={tabListShell}>
                <TabsTrigger value="solved" className={tabTrigger}>
                  Solved Labs
                </TabsTrigger>
                <TabsTrigger value="community" className={tabTrigger}>
                  Community Solutions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="solved" className="mt-4">
                {/* Child đã tự render card/graph/border của nó */}
                <UserSolvedSection labs={solvedLabs} loading={labsLoading} />
              </TabsContent>

              <TabsContent value="community" className="mt-4">
                <Card className="bg-transparent border border-[#ffffff]/10 rounded-2xl backdrop-blur-sm hover:border-[#9747ff]/40 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-white">My Community Solutions</CardTitle>
                  </CardHeader>
                  <CardContent className="text-white">
                    {loading ? (
                      <Skeleton className="h-[300px] w-full rounded-xl bg-white/10" />
                    ) : (
                      <CommunitySolutionsTab solutions={communitySolutions} />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>
          </section>
        </div>
      </main>


    </div>
  );
}
