"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserProfileCard } from "@/components/dashboard/user-profile-card";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { CommunitySolutionsTab } from "@/components/dashboard/community-solutions-tab";
import { UserSolvedSection } from "@/components/dashboard/user-solved-section";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL as string;

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [communitySolutions, setCommunitySolutions] = useState<any[]>([]);
  const [solvedLabs, setSolvedLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [labsLoading, setLabsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
      } catch (e: any) {
        console.error(e);
        setDashboardData(null);
        setCommunitySolutions([]);
        setErrorMsg(e?.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Load solved labs (hiển thị biểu đồ & bảng)
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
        const normalized = raw.map((x: any) => ({
          labId: x.labId,
          labName: x.labName ?? x.name ?? x.title ?? "Unknown",
          difficulty: x.difficulty ?? "Unknown",
          completedAt: x.completedAt, // ISO
          errorCount: Number.isFinite(x.errorCount) ? x.errorCount : Number(x.errorCount ?? 0),
        }));
        setSolvedLabs(normalized);
      } catch (e: any) {
        console.error(e);
        setSolvedLabs([]);
        setErrorMsg(e?.message || "Failed to load solved labs.");
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
    }),
    [dashboardData]
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
              <Card className="bg-transparent border-white/10">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </CardHeader>
              </Card>
            ) : (
              <div className="text-white">
                {/* Truyền object thay vì string */}
                <UserProfileCard user={userForCard} proficiencyLevel={dashboardData?.proficiencyLevel} />
              </div>
            )}
          </section>

          {/* Dashboard Stats */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-white">Dashboard</h2>
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-[140px] w-full" />
                <Skeleton className="h-[140px] w-full" />
                <Skeleton className="h-[140px] w-full" />
                <Skeleton className="h-[140px] w-full" />
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
              <TabsList className="grid w-full grid-cols-2 bg-white/10 text-white">
                <TabsTrigger value="solved" className="data-[state=active]:bg-white/20 data-[state=active]:text-white">
                  Solved Labs
                </TabsTrigger>
                <TabsTrigger value="community" className="data-[state=active]:bg-white/20 data-[state=active]:text-white">
                  Community Solutions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="solved" className="mt-4">
                <UserSolvedSection labs={solvedLabs} loading={labsLoading} />
              </TabsContent>

              <TabsContent value="community" className="mt-4">
                <Card className="bg-transparent border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">My Community Solutions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-[300px] w-full" />
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

      <Footer />
    </div>
  );
}
