"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { LabStatusPieChart } from "@/components/admin/labs/statistics/lab-status-pie-chart"
import { SubmissionStats } from "@/components/admin/labs/statistics/submission-stats"
import { AverageTimeStat } from "@/components/admin/labs/statistics/average-time-stat"
import { LabActivityChart } from "@/components/admin/labs/statistics/lab-activity-chart"
import { UserLabActivityTable } from "@/components/admin/labs/statistics/user-lab-activity-table"
import { CommunitySolutionsTable } from "@/components/admin/labs/statistics/community-solutions-table"
import { LabLogsTable } from "@/components/admin/labs/statistics/lab-logs-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

interface LabDetails {
  name: string
}

export default function LabStatisticsPage() {
  const params = useParams()
  const labId = params.id as string
  const [lab, setLab] = useState<LabDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!labId) return

    const fetchLabDetails = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/labs/${labId}`, { credentials: "include" })
        if (!res.ok) throw new Error("Failed to fetch lab details.")
        const data = await res.json()
        setLab(data)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "An unknown error occurred.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchLabDetails()
  }, [labId])

  if (isLoading) {
    return <div className="text-white">Loading statistics...</div>
  }

  if (!lab) {
    return <div className="text-red-400">Failed to load lab details.</div>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">
        Statistics for <span className="text-primary">{lab.name}</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SubmissionStats labId={labId} />
        <AverageTimeStat labId={labId} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <LabActivityChart labId={labId} />
        </div>
        <div>
          <LabStatusPieChart labId={labId} />
        </div>
      </div>

      <Tabs defaultValue="user-activity">
        <TabsList className="mb-4 bg-[#ffffff]/5 border border-[#ffffff]/20 rounded-xl">
          <TabsTrigger
            value="user-activity"
            className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#9747ff]/20 data-[state=active]:to-[#5a5bed]/10 data-[state=active]:text-white rounded-lg text-white/70"
          >
            User Activity
          </TabsTrigger>
          <TabsTrigger
            value="community-solutions"
            className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#9747ff]/20 data-[state=active]:to-[#5a5bed]/10 data-[state=active]:text-white rounded-lg text-white/70"
          >
            Community Solutions
          </TabsTrigger>
          <TabsTrigger
            value="lab-logs"
            className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#9747ff]/20 data-[state=active]:to-[#5a5bed]/10 data-[state=active]:text-white rounded-lg text-white/70"
          >
            Lab Logs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="user-activity">
          <UserLabActivityTable labId={labId} />
        </TabsContent>
        <TabsContent value="community-solutions">
          <CommunitySolutionsTable labId={labId} />
        </TabsContent>
        <TabsContent value="lab-logs">
          <LabLogsTable labId={labId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
