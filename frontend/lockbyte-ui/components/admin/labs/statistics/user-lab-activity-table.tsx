"use client"

import { useEffect, useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UserLabActivity {
  userId: number
  fullName: string
  errorCount: number
  labAccessCount: number
  totalSolved: number
  firstSolvedTimeSeconds: number | null
  fastestSolveTimeSeconds: number | null
  averageSolveTimeSeconds: number | null
}

type SortKey = keyof UserLabActivity;

export function UserLabActivityTable({ labId }: { labId: string }) {
  const [data, setData] = useState<UserLabActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'totalSolved', direction: 'descending' });

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

  const sortedData = useMemo(() => {
    const sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Handle nulls by pushing them to the end
        if (aValue === null) return 1;
        if (bValue === null) return -1;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortConfig.direction === 'ascending' ? ' ' : ' ';
  };

  const formatTime = (seconds: number | null) => {
    if (seconds === null || seconds === undefined) return "N/A"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }

  const renderHeader = (key: SortKey, label: string) => (
    <TableHead className="text-white font-semibold border-r border-white/10">
      <Button variant="ghost" onClick={() => requestSort(key)} className="px-2 py-1 hover:bg-white/10">
        {label} {getSortIndicator(key)}
      </Button>
    </TableHead>
  );

  if (isLoading) {
    return <div className="text-white">Loading user activity...</div>
  }

  if (error) {
    return <div className="text-red-400">Error: {error}</div>
  }

  return (
    <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm p-6 rounded-xl border border-[#ffffff]/10 h-full shadow-[0_0_15px_rgba(151,71,255,0.15)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(151,71,255,0.3)]">
      <h3 className="text-lg font-semibold text-white mb-4">User Lab Activity</h3>
      {sortedData.length === 0 ? (
        <p className="text-white/70">No user activity found for this lab.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/10">
                {renderHeader('userId', 'User ID')}
                {renderHeader('fullName', 'Full Name')}
                {renderHeader('errorCount', 'Error Count')}
                {renderHeader('labAccessCount', 'Access Count')}
                {renderHeader('totalSolved', 'Total Solved')}
                {renderHeader('firstSolvedTimeSeconds', 'First Solve Time')}
                {renderHeader('fastestSolveTimeSeconds', 'Fastest Solve Time')}
                {renderHeader('averageSolveTimeSeconds', 'Average Solve Time')}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((userActivity) => (
                <TableRow key={userActivity.userId} className="border-b border-white/10 hover:bg-white/5">
                  <TableCell className="font-medium text-white border-r border-white/10">{userActivity.userId}</TableCell>
                  <TableCell className="text-white/80 border-r border-white/10">{userActivity.fullName}</TableCell>
                  <TableCell className="text-white/80 border-r border-white/10">{userActivity.errorCount}</TableCell>
                  <TableCell className="text-white/80 border-r border-white/10">{userActivity.labAccessCount}</TableCell>
                  <TableCell className="text-white/80 border-r border-white/10">{userActivity.totalSolved}</TableCell>
                  <TableCell className="text-white/80 border-r border-white/10">{formatTime(userActivity.firstSolvedTimeSeconds)}</TableCell>
                  <TableCell className="text-white/80 border-r border-white/10">{formatTime(userActivity.fastestSolveTimeSeconds)}</TableCell>
                  <TableCell className="text-white/80">{formatTime(userActivity.averageSolveTimeSeconds)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  )
}
