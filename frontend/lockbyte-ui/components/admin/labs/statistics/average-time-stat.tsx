"use client"
import { useEffect, useState } from "react"
import { StatCard } from "@/components/admin/stat-card"
import { Icons } from "@/components/icons"
import { toast } from "sonner"

interface AvgTimeData {
  solved_count: number
  average_time_seconds: number
}

export function AverageTimeStat({ labId }: { labId: string }) {
  const [data, setData] = useState<AvgTimeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lab/avg-time-solved/${labId}`, { credentials: "include" })
        if (!res.ok) throw new Error("Failed to fetch average time data.")
        const responseData = await res.json()
        setData(responseData.body)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "An unknown error occurred.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [labId])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <StatCard
      icon={Icons.Clock}
      title="Avg. Solve Time"
      value={isLoading ? "..." : data ? formatTime(data.average_time_seconds) : "N/A"}
    />
  )
}
