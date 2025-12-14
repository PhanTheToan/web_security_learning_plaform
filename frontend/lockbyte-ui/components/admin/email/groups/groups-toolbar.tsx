"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  keyword: string;
  onKeywordChange: (v: string) => void;
  onCreate: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
};

export function GroupsToolbar({ keyword, onKeywordChange, onCreate, onRefresh, isRefreshing }: Props) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex gap-2">
        <Input
          className="w-[320px] border-purple-500/30 bg-white/5 text-white placeholder:text-gray-400"
          placeholder="Search groups..."
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
        />
        <Button variant="secondary" onClick={onRefresh} disabled={!!isRefreshing} className="text-white">
          Refresh
        </Button>
      </div>

      <Button onClick={onCreate} className="text-white">Create Group</Button>
    </div>
  );
}
