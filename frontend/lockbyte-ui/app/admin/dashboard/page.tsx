"use client"
import Link from "next/link"
import dynamic from "next/dynamic"
import { StatCard } from "@/components/admin/stat-card"
import { SolvedLabsChart } from "@/components/admin/dashboard/solved-labs-chart"
import { RecentActivity } from "@/components/admin/recent-activity"
import { DockerManager } from "@/components/admin/dashboard/docker-manager"
import { RankingTable } from "@/components/admin/dashboard/ranking-table"
import { Icons } from "@/components/icons"
import { useEffect, useState } from "react"
import { toast } from "sonner"

// Dynamically import ActivityChart with SSR turned off to prevent hydration errors
const ActivityChart = dynamic(() => import("@/components/admin/activity-chart").then((mod) => mod.ActivityChart), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] bg-gray-900/50 rounded-lg flex items-center justify-center">
      <p className="text-white/70">Loading Chart...</p>
    </div>
  ),
})

interface AdminStatistics {
  labSolvedCount: number
  labExpiredCount: number
  totalLabs: number
  totalUsers: number
}

export default function AdminDashboardPage() {
  const [statistics, setStatistics] = useState<AdminStatistics | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const fetchStatistics = async () => {
      setIsLoadingStats(true)
      try {
        const res = await fetch(`${apiBaseUrl}/admin/statistics`, { credentials: "include" })
        if (!res.ok) throw new Error("Failed to fetch admin statistics.")
        const data = await res.json()
        setStatistics(data.body) // Assuming the actual data is in the 'body' field
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "An unknown error occurred while fetching statistics.")
      } finally {
        setIsLoadingStats(false)
      }
    }
    fetchStatistics()
  }, [apiBaseUrl])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>

      {/* Quick Stats Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/users">
          <StatCard
            icon={Icons.Users}
            title="Total Users"
            value={isLoadingStats ? "..." : statistics?.totalUsers.toLocaleString() || "N/A"}
          />
        </Link>
        <Link href="/admin/labs">
          <StatCard
            icon={Icons.Labs}
            title="Total Labs"
            value={isLoadingStats ? "..." : statistics?.totalLabs.toLocaleString() || "N/A"}
          />
        </Link>
        <Link href="/admin/topics">
          <StatCard icon={Icons.Topics} title="Total Topics" value="15" />
        </Link>
        <Link href="/admin/solves">
          <StatCard
            icon={Icons.Flag}
            title="Total Solves"
            value={isLoadingStats ? "..." : statistics?.labSolvedCount.toLocaleString() || "N/A"}
          />
        </Link>
      </div>

      {/* Shortcuts & Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActivityChart />
        </div>
        <div>
          <SolvedLabsChart />
        </div>
      </div>

      {/* Recent Activity Area */}
      <div>
        <RecentActivity />
      </div>

      {/* Ranking Table Area */}
      <div>
        <RankingTable />
      </div>

      {/* Docker Manager Area */}
      <div>
        <DockerManager />
      </div>
    </div>
  )
}
