"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { getAdminEmailLogs, resendEmailByLogId } from "@/lib/api"
import { EmailLog, PageResp } from "@/types/email"
import { LogsTable } from "@/components/admin/email/logs-table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function LogsPage() {
  const [logs, setLogs] = useState<PageResp<EmailLog> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    keyword: "",
    status: "",
    page: 0,
    size: 10,
  })
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const debouncedKeyword = useDebounce(filters.keyword, 500)

  const fetchLogs = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getAdminEmailLogs({
        ...filters,
        keyword: debouncedKeyword,
      })
      setLogs(data)
    } catch (error) {
      console.error("Failed to fetch logs", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch email logs.",
      })
    } finally {
      setIsLoading(false)
    }
  }, [filters, debouncedKeyword])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const handleViewDetails = (log: EmailLog) => {
    setSelectedLog(log)
    setIsDetailOpen(true)
  }

  const handleResend = async (log: EmailLog) => {
    try {
      await resendEmailByLogId(log.id);
      toast({ title: "Queued", description: `Resend queued for log #${log.id}` });
      fetchLogs(); // refresh list
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Resend failed." });
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
  }

  const inputClassName = "bg-transparent border-[#ffffff]/20 focus:border-[#9747ff] focus:ring-[#9747ff] text-white"

  return (
    <div className="space-y-6 text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Email Logs</h1>
      </div>

      <div className="flex items-center space-x-4">
        <Input
          placeholder="Search by recipient, subject..."
          value={filters.keyword}
          onChange={(e) =>
            setFilters({ ...filters, keyword: e.target.value, page: 0 })
          }
          className={`max-w-sm ${inputClassName}`}
        />
        <Select
          value={filters.status === "" ? "all" : filters.status}
          onValueChange={(value) =>
            setFilters({ ...filters, status: value === "all" ? "" : value, page: 0 })
          }
        >
          <SelectTrigger className={`w-[180px] ${inputClassName}`}>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="SENT">Sent</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full bg-white/10" />
          ))}
        </div>
      ) : (
        <LogsTable
          data={logs}
          onView={handleViewDetails}
          onResend={handleResend}
        />
      )}

      {logs && logs.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(Math.max(0, filters.page - 1))
                }}
                className={filters.page === 0 ? "pointer-events-none opacity-50" : "hover:bg-white/10 rounded-md"}
              />
            </PaginationItem>
            {[...Array(logs.totalPages).keys()].map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(p)
                  }}
                  isActive={filters.page === p}
                  className={filters.page === p ? "bg-[#9747ff]/30 border border-[#9747ff]/50 rounded-md" : "hover:bg-white/10 rounded-md"}
                >
                  {p + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(Math.min(logs.totalPages - 1, filters.page + 1))
                }}
                className={filters.page === logs.totalPages - 1 ? "pointer-events-none opacity-50" : "hover:bg-white/10 rounded-md"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl bg-[#1a1a2e] border-[#ffffff]/20 text-white">
          <DialogHeader>
            <DialogTitle>Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 text-sm">
              <p><strong>ID:</strong> {selectedLog.id}</p>
              <p><strong>To:</strong> {selectedLog.toEmail}</p>
              {selectedLog.cc && <p><strong>CC:</strong> {selectedLog.cc}</p>}
              {selectedLog.bcc && <p><strong>BCC:</strong> {selectedLog.bcc}</p>}
              <p><strong>Subject:</strong> {selectedLog.subject}</p>
              <p><strong>Template:</strong> {selectedLog.templateName}</p>
              <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs ${selectedLog.status === 'SENT' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>{selectedLog.status}</span></p>
              <p><strong>Sent At:</strong> {new Date(selectedLog.sentAt).toLocaleString()}</p>
              {selectedLog.errorMessage && <p><strong>Error:</strong> {selectedLog.errorMessage}</p>}
              {selectedLog.metadataJson && (
                <div>
                  <strong>Metadata:</strong>
                  <pre className="mt-2 p-4 bg-black/20 rounded-md text-xs overflow-x-auto border border-white/10">
                    <code>{JSON.stringify(JSON.parse(selectedLog.metadataJson), null, 2)}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
