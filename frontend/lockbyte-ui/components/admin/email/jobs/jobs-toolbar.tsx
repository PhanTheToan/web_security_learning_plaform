"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { EmailJobStatus } from "@/types/email-jobs";

export function JobsToolbar(props: {
  keyword: string;
  onKeywordChange: (v: string) => void;

  status: EmailJobStatus | "ALL";
  onStatusChange: (v: EmailJobStatus | "ALL") => void;

  groupId: string;
  onGroupIdChange: (v: string) => void;

  onRefresh: () => void;
  isRefreshing: boolean;
}) {
  const inputStyles = "bg-transparent border-white/20 focus:ring-2 focus:ring-[#9747ff]";
  const selectTriggerStyles = "bg-transparent border-white/20 focus:ring-2 focus:ring-[#9747ff]";
  const selectContentStyles = "bg-gray-800 border-white/20 text-white";
  const selectItemStyles = "focus:bg-white/10";

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <Input
          className={`w-full md:w-[320px] ${inputStyles}`}
          placeholder="Search by jobId / subject..."
          value={props.keyword}
          onChange={(e) => props.onKeywordChange(e.target.value)}
        />

        <Input
          className={`w-full md:w-[180px] ${inputStyles}`}
          placeholder="groupId (optional)"
          value={props.groupId}
          onChange={(e) => props.onGroupIdChange(e.target.value)}
        />

        <Select value={props.status} onValueChange={(v) => props.onStatusChange(v as any)}>
          <SelectTrigger className={`w-full md:w-[200px] ${selectTriggerStyles}`}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className={selectContentStyles}>
            <SelectItem value="ALL" className={selectItemStyles}>ALL</SelectItem>
            <SelectItem value="QUEUED" className={selectItemStyles}>QUEUED</SelectItem>
            <SelectItem value="RUNNING" className={selectItemStyles}>RUNNING</SelectItem>
            <SelectItem value="PAUSED" className={selectItemStyles}>PAUSED</SelectItem>
            <SelectItem value="COMPLETED" className={selectItemStyles}>COMPLETED</SelectItem>
            <SelectItem value="FAILED" className={selectItemStyles}>FAILED</SelectItem>
            <SelectItem value="CANCELLED" className={selectItemStyles}>CANCELLED</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={props.onRefresh}
          disabled={props.isRefreshing}
          className="bg-transparent border-white/20 hover:bg-white/10"
        >
          Refresh
        </Button>
      </div>
    </div>
  );
}
