"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"

interface UserLabActivity {
  userId: number
  fullName: string
  errorCount: number
  labAccessCount: number
  totalSolved: number
  fastestSolveTimeSeconds: number | null
}

export function UserLabActivityTable({ labId }: { labId: string }) {
  const [data, setData] = useState<UserLabActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lab/user-lab-count?labId=${labId}`, { credentials: "include" })
        if (!res.ok) throw new Error("Failed to fetch user lab activity data.")
        const responseData = await res.json()
        setData(responseData.body || [])
      } catch (e) {
        setError(e instanceof Error ? e.message : "An unknown error occurred.")
        toast.error(e instanceof Error ? e.message : "An unknown error occurred.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [labId])

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "Not Solved"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }

  if (isLoading) {
    return <div className="text-white">Loading user activity...</div>
  }

  if (error) {
    return <div className="text-red-400">Error: {error}</div>
  }

  return (
    <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm p-6 rounded-xl border border-[#ffffff]/10 h-full shadow-[0_0_15px_rgba(151,71,255,0.15)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(151,71,255,0.3)]">
      <h3 className="text-lg font-semibold text-white mb-4">User Lab Activity</h3>
      {data.length === 0 ? (
        <p className="text-white/70">No user activity found for this lab.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/10">
                <TableHead className="text-white font-semibold border-r border-white/10">User ID</TableHead>
                <TableHead className="text-white font-semibold border-r border-white/10">Full Name</TableHead>
                <TableHead className="text-white font-semibold border-r border-white/10">Error Count</TableHead>
                <TableHead className="text-white font-semibold border-r border-white/10">Lab Access Count</TableHead>
                <TableHead className="text-white font-semibold border-r border-white/10">Total Solved</TableHead>
                <TableHead className="text-white font-semibold">Fastest Solve Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((userActivity) => (
                <TableRow key={userActivity.userId} className="border-b border-white/10 hover:bg-white/5">
                  <TableCell className="font-medium text-white border-r border-white/10">{userActivity.userId}</TableCell>
                  <TableCell className="text-white/80 border-r border-white/10">{userActivity.fullName}</TableCell>
                  <TableCell className="text-white/80 border-r border-white/10">{userActivity.errorCount}</TableCell>
                  <TableCell className="text-white/80 border-r border-white/10">{userActivity.labAccessCount}</TableCell>
                  <TableCell className="text-white/80 border-r border-white/10">{userActivity.totalSolved}</TableCell>
                  <TableCell className="text-white/80">{formatTime(userActivity.fastestSolveTimeSeconds)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  )
}
