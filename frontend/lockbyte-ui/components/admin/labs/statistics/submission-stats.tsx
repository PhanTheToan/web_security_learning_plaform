"use client"
import { useEffect, useState } from "react"
import { StatCard } from "@/components/admin/stat-card"
import { Icons } from "@/components/icons"
import { toast } from "sonner"

interface SubmissionData {
  total_correct_submissions: number
  total_error_submissions: number
}

export function SubmissionStats({ labId }: { labId: string }) {
  const [data, setData] = useState<SubmissionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lab/error-submit/${labId}`, { credentials: "include" })
        if (!res.ok) throw new Error("Failed to fetch submission data.")
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

  return (
    <>
      <StatCard
        icon={Icons.CheckCircle}
        title="Correct Submissions"
        value={isLoading ? "..." : data?.total_correct_submissions.toLocaleString() ?? "N/A"}
      />
      <StatCard
        icon={Icons.XCircle}
        title="Incorrect Submissions"
        value={isLoading ? "..." : data?.total_error_submissions.toLocaleString() ?? "N/A"}
      />
    </>
  )
}
