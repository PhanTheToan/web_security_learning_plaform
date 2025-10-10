"use client"
import Link from "next/link"
import dynamic from "next/dynamic"
import { StatCard } from "@/components/admin/stat-card"
import { QuickShortcuts } from "@/components/admin/quick-shortcuts"
import { RecentActivity } from "@/components/admin/recent-activity"
import { Icons } from "@/components/icons"

// Dynamically import ActivityChart with SSR turned off to prevent hydration errors
const ActivityChart = dynamic(() => import("@/components/admin/activity-chart").then((mod) => mod.ActivityChart), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] bg-gray-900/50 rounded-lg flex items-center justify-center">
      <p className="text-white/70">Loading Chart...</p>
    </div>
  ),
})

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>

      {/* Quick Stats Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/users">
          <StatCard icon={Icons.Users} title="Total Users" value="1,283" />
        </Link>
        <Link href="/admin/labs">
          <StatCard icon={Icons.Labs} title="Total Labs" value="72" />
        </Link>
        <Link href="/admin/topics">
          <StatCard icon={Icons.Topics} title="Total Topics" value="15" />
        </Link>
        <Link href="/admin/solves">
          <StatCard icon={Icons.Flag} title="Total Solves" value="8,491" />
        </Link>
      </div>

      {/* Shortcuts & Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActivityChart />
        </div>
        <div>
          <QuickShortcuts />
        </div>
      </div>

      {/* Recent Activity Area */}
      <div>
        <RecentActivity />
      </div>
    </div>
  )
}
