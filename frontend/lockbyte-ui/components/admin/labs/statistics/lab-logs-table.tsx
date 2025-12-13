"use client"

import { useEffect, useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface LabLog {
  completedAt: string | null;
  startedAt: string;
  flagSubmitted: string;
  sessionId: number;
  counterErrorFlag: number;
  containerId: string;
  userId: number;
  expiresAt: string;
  username: string;
  status: 'EXPIRED' | 'SOLVED' | 'RUNNING';
}

type SortKey = keyof LabLog;

export function LabLogsTable({ labId }: { labId: string }) {
  const [data, setData] = useState<LabLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'startedAt', direction: 'descending' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lab/logs/${labId}`, { credentials: "include" })
        if (!res.ok) throw new Error("Failed to fetch lab logs.")
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
    return sortConfig.direction === 'ascending' ? '' : ' ';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('en-GB', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  const renderHeader = (key: SortKey, label: string) => (
    <TableHead className="text-white font-semibold border-r border-white/10">
      <Button variant="ghost" onClick={() => requestSort(key)} className="px-2 py-1 hover:bg-white/10">
        {label} {getSortIndicator(key)}
      </Button>
    </TableHead>
  );

  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      RUNNING: "bg-blue-500/10 text-blue-300 border-blue-500/20",
      SOLVED: "bg-green-500/10 text-green-300 border-green-500/20",
      EXPIRED: "bg-gray-500/10 text-gray-300 border-gray-500/20",
    };
    const className = styles[status as keyof typeof styles] || "bg-gray-500/10 text-gray-300";
    return <Badge className={className}>{status}</Badge>
  }

  if (isLoading) {
    return <div className="text-white">Loading lab logs...</div>
  }

  if (error) {
    return <div className="text-red-400">Error: {error}</div>
  }

  return (
    <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm p-6 rounded-xl border border-[#ffffff]/10 h-full shadow-[0_0_15px_rgba(151,71,255,0.15)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(151,71,255,0.3)]">
      <h3 className="text-lg font-semibold text-white mb-4">Lab Session Logs</h3>
      {sortedData.length === 0 ? (
        <p className="text-white/70">No logs found for this lab.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/10">
                {renderHeader('username', 'User')}
                {renderHeader('status', 'Status')}
                {renderHeader('startedAt', 'Started At')}
                {renderHeader('completedAt', 'Completed At')}
                {renderHeader('expiresAt', 'Expires At')}
                {renderHeader('counterErrorFlag', 'Errors')}
                {renderHeader('flagSubmitted', 'Flag Submitted')}
                {renderHeader('containerId', 'Container ID')}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((log) => (
                <TableRow key={log.sessionId} className="border-b border-white/10 hover:bg-white/5">
                  <TableCell className="text-white/80 border-r border-white/10">{log.username}</TableCell>
                  <TableCell className="border-r border-white/10"><StatusBadge status={log.status} /></TableCell>
                  <TableCell className="text-white/80 border-r border-white/10">{formatDate(log.startedAt)}</TableCell>
                  <TableCell className="text-white/80 border-r border-white/10">{formatDate(log.completedAt)}</TableCell>
                  <TableCell className="text-white/80 border-r border-white/10">{formatDate(log.expiresAt)}</TableCell>
                  <TableCell className="text-white/80 border-r border-white/10">{log.counterErrorFlag}</TableCell>
                  <TableCell className="text-white/80 border-r border-white/10 text-xs font-mono">{log.flagSubmitted}</TableCell>
                  <TableCell className="text-white/80 text-xs font-mono">{log.containerId.substring(0, 12)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  )
}
