"use client";

import type { EmailJob } from "@/types/email-jobs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

function canPause(status: string) {
  return status === "RUNNING";
}
function canResume(status: string) {
  return status === "PAUSED";
}
function canCancel(status: string) {
  return status === "QUEUED" || status === "RUNNING" || status === "PAUSED";
}

export function JobsTable(props: {
  data: EmailJob[];
  loading: boolean;

  page: number;
  size: number;
  total: number;
  onPageChange: (p: number) => void;
  onSizeChange: (s: number) => void;

  onView: (job: EmailJob) => void;
  onPause: (job: EmailJob) => void;
  onResume: (job: EmailJob) => void;
  onCancel: (job: EmailJob) => void;
}) {
  const totalPages = Math.max(1, Math.ceil((props.total ?? 0) / (props.size || 1)));

  return (
    <div className="rounded-lg border border-white/10 bg-white/5">
      <div className="w-full overflow-auto">
        <table className="w-full text-sm text-white">
          <thead className="border-b border-white/10 bg-white/5">
            <tr>
              <th className="p-3 text-left font-semibold text-gray-400">Job ID</th>
              <th className="p-3 text-left font-semibold text-gray-400">Group</th>
              <th className="p-3 text-left font-semibold text-gray-400">Template</th>
              <th className="p-3 text-left font-semibold text-gray-400">Subject</th>
              <th className="p-3 text-left font-semibold text-gray-400">Status</th>
              <th className="p-3 text-left font-semibold text-gray-400">Progress</th>
              <th className="p-3 text-left font-semibold text-gray-400">Created</th>
              <th className="p-3 text-left font-semibold text-gray-400">Actions</th>
            </tr>
          </thead>

          <tbody>
            {props.loading ? (
              <tr>
                <td className="p-3 text-center text-gray-400" colSpan={8}>
                  Loading...
                </td>
              </tr>
            ) : props.data.length === 0 ? (
              <tr>
                <td className="p-3 text-center text-gray-400" colSpan={8}>
                  No jobs.
                </td>
              </tr>
            ) : (
              props.data.map((j) => (
                <tr key={j.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                  <td className="p-3 font-mono text-xs text-gray-400">{j.id}</td>
                  <td className="p-3">{j.groupId ?? "-"}</td>
                  <td className="p-3">{j.templateName ?? "-"}</td>
                  <td className="p-3">{j.subject ?? "-"}</td>
                  <td className="p-3">
                    <Badge variant="secondary">{j.status}</Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span>
                        {j.sent}/{j.total}
                      </span>
                      <span className="text-gray-400">failed: {j.failed}</span>
                    </div>
                  </td>
                  <td className="p-3 text-gray-400">{j.createdAt ?? "-"}</td>
                  <td className="p-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="border-white/20 text-white rounded-2xl bg-white/5 bg-blurbg-card/95 text-white shadow-xl backdrop-blur-sm">
                        <DropdownMenuItem onClick={() => props.onView(j)} className="hover:bg-white/10 focus:bg-white/10 rounded-2xl">
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => props.onPause(j)} disabled={!canPause(j.status)} className="hover:bg-white/10 focus:bg-white/10 rounded-2xl">
                          Pause
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => props.onResume(j)} disabled={!canResume(j.status)} className="hover:bg-white/10 focus:bg-white/10 rounded-2xl">
                          Resume
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500 hover:bg-white/10 focus:bg-white/10"
                          onClick={() => props.onCancel(j)}
                          disabled={!canCancel(j.status)}
                        >
                          Cancel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-2 p-3 border-t border-white/10">
        <div className="text-sm text-gray-400">
          Page {props.page + 1}/{totalPages} • Total {props.total}
        </div>

        <div className="flex items-center gap-2">
          <select
            className="h-9 rounded-md border border-white/20 bg-transparent px-2 text-sm text-white focus:ring-2 focus:ring-[#9747ff]"
            value={props.size}
            onChange={(e) => props.onSizeChange(Number(e.target.value))}
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n} className="bg-gray-800 text-white">
                {n}/page
              </option>
            ))}
          </select>

          <Button
            size="sm"
            variant="outline"
            className="bg-transparent border-white/20 hover:bg-white/10"
            disabled={props.page <= 0}
            onClick={() => props.onPageChange(props.page - 1)}
          >
            Prev
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-transparent border-white/20 hover:bg-white/10"
            disabled={props.page + 1 >= totalPages}
            onClick={() => props.onPageChange(props.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
