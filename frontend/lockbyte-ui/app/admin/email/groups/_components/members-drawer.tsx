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
  onRemoveMember: (memberId: number) => void | Promise<void>;
  onRefresh: () => void;
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
  onRemoveMember,
  onRefresh,
}: Props) {
  const [openAdd, setOpenAdd] = useState(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[720px] border-white/10 bg-gray-950 text-white">
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
              <Button variant="secondary" onClick={onRefresh} disabled={!!loading} className="text-white">
                Refresh
              </Button>
            </div>

            <Button onClick={() => setOpenAdd(true)} disabled={!group} className="text-white">
              Add Members
            </Button>
          </div>

          <MembersTable
            data={members}
            loading={loading}
            page={page}
            size={size}
            total={total}
            onPageChange={onPageChange}
            onSizeChange={onSizeChange}
            onRemove={onRemoveMember}
          />

          <AddMembersDialog
            open={openAdd}
            onOpenChange={setOpenAdd}
            onSubmit={onAddMembers}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
