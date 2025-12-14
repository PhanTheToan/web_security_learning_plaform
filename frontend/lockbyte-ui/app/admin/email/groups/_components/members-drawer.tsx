"use client";

import { useState } from "react";
import type { EmailGroup, EmailGroupMember } from "@/types/email";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { MembersTable } from "./members-table";
import { AddMembersDialog } from "./add-members-dialog";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  group: EmailGroup | null;

  members: EmailGroupMember[];
  loading?: boolean;
  page: number;
  size: number;
  total: number;

  keyword: string;
  onKeywordChange: (v: string) => void;

  onPageChange: (p: number) => void;
  onSizeChange: (s: number) => void;

  onAddMembers: (payload: { emails?: string[]; userIds?: number[] }) => void | Promise<void>;
  onRefresh: () => void;

  // ===== Option B selection =====
  selectedUserIds: number[];
  onSelectedUserIdsChange: (ids: number[]) => void;
  onRemoveSelected: () => void | Promise<void>;
  onClearSelection: () => void;
};

export function MembersDrawer({
  open,
  onOpenChange,
  group,
  members,
  loading,
  page,
  size,
  total,
  keyword,
  onKeywordChange,
  onPageChange,
  onSizeChange,
  onAddMembers,
  onRefresh,
  selectedUserIds,
  onSelectedUserIdsChange,
  onRemoveSelected,
  onClearSelection,
}: Props) {
  const [openAdd, setOpenAdd] = useState(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[760px] border-white/10 bg-gray-950 text-white">
        <SheetHeader>
          <SheetTitle>Group Members {group ? `— ${group.name}` : ""}</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <Input
                className="w-[320px] border-purple-500/30 bg-white/5 text-white placeholder:text-gray-400"
                placeholder="Search members..."
                value={keyword}
                onChange={(e) => onKeywordChange(e.target.value)}
              />
              <Button variant="secondary" onClick={onRefresh} disabled={!!loading}>
                Refresh
              </Button>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setOpenAdd(true)} disabled={!group}>
                Add Members
              </Button>
            </div>
          </div>

          {/* Option B: selection toolbar */}
          <div className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/5 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-300">
              Selected: <span className="text-white">{selectedUserIds.length}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={onClearSelection} disabled={selectedUserIds.length === 0}>
                Clear
              </Button>
              <Button variant="destructive" onClick={onRemoveSelected} disabled={selectedUserIds.length === 0}>
                Remove selected
              </Button>
            </div>
          </div>

          <MembersTable
            data={members}
            loading={loading}
            page={page}
            size={size}
            total={total}
            onPageChange={onPageChange}
            onSizeChange={onSizeChange}
            // Option B props
            selectedUserIds={selectedUserIds}
            onSelectedUserIdsChange={onSelectedUserIdsChange}
          />

          <AddMembersDialog open={openAdd} onOpenChange={setOpenAdd} onSubmit={onAddMembers} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
