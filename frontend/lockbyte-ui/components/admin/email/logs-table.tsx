"use client"

import React from "react"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { EmailLog } from "@/types/email"
import type { PageResp } from "@/types/pagination"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Eye, Send } from "lucide-react"

interface LogsTableProps {
  data: PageResp<EmailLog> | null
  onView: (log: EmailLog) => void
  onResend: (log: EmailLog) => void
}

export function LogsTable({ data, onView, onResend }: LogsTableProps) {
  if (!data || !data.content || data.content.length === 0) {
    return <p className="text-gray-400">No logs found.</p>
  }

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b-white/10 hover:bg-transparent">
            <TableHead className="text-white">Sent At</TableHead>
            <TableHead className="text-white">To</TableHead>
            <TableHead className="text-white">Subject</TableHead>
            <TableHead className="text-white">Template</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.content.map((log) => (
            <TableRow key={log.id} className="border-b-white/10 odd:bg-white/5 hover:bg-white/10">
              <TableCell className="text-gray-300">{new Date(log.sentAt).toLocaleString()}</TableCell>
              <TableCell className="text-gray-300">{log.toEmail}</TableCell>
              <TableCell className="text-gray-300">{log.subject}</TableCell>
              <TableCell className="text-gray-300">{log.templateName}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium
                    ${log.status === "SENT"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-red-500/20 text-red-300"
                    }`}
                >
                  {log.status}
                </span>
                {log.status === "FAILED" && log.errorMessage && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="ml-2 cursor-pointer text-red-400">...</span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#1a1a2e] border-white/10 text-white">
                        <p>{log.errorMessage}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </TableCell>
              <TableCell className="space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onView(log)} className="text-gray-400 hover:text-white">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onResend(log)} className="text-gray-400 hover:text-white">
                  <Send className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
