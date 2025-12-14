"use client";

import type { EmailGroupMember } from "@/types/email";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  data: EmailGroupMember[];
  loading?: boolean;
  page: number;
  size: number;
  total: number;
  onPageChange: (p: number) => void;
  onSizeChange: (s: number) => void;

  // Option B selection
  selectedUserIds: number[];
  onSelectedUserIdsChange: (ids: number[]) => void;
};

export function MembersTable({
  data,
  loading,
  page,
  size,
  total,
  onPageChange,
  onSizeChange,
  selectedUserIds,
  onSelectedUserIdsChange,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, size)));

  const isSelected = (userId: number) => selectedUserIds.includes(userId);

  const toggleOne = (userId: number, checked: boolean) => {
    if (checked) {
      if (!selectedUserIds.includes(userId)) onSelectedUserIdsChange([...selectedUserIds, userId]);
    } else {
      onSelectedUserIdsChange(selectedUserIds.filter((id) => id !== userId));
    }
  };

  const pageUserIds = data.map((m) => m.userId);
  const allCheckedOnPage = pageUserIds.length > 0 && pageUserIds.every((id) => selectedUserIds.includes(id));
  const someCheckedOnPage = pageUserIds.some((id) => selectedUserIds.includes(id));

  const toggleAllOnPage = (checked: boolean) => {
    if (checked) {
      const merged = Array.from(new Set([...selectedUserIds, ...pageUserIds]));
      onSelectedUserIdsChange(merged);
    } else {
      onSelectedUserIdsChange(selectedUserIds.filter((id) => !pageUserIds.includes(id)));
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-white/10 bg-white/5">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="w-[48px]">
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={allCheckedOnPage ? true : someCheckedOnPage ? "indeterminate" : false}
                    onCheckedChange={(v) => toggleAllOnPage(!!v)}
                  />
                </div>
              </TableHead>
              <TableHead className="text-gray-300">UserId</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={3} className="text-gray-300">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={3} className="text-gray-300">
                  No members found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((m) => (
                <TableRow key={m.userId} className="border-white/10">
                  <TableCell className="w-[48px]">
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={isSelected(m.userId)}
                        onCheckedChange={(v) => toggleOne(m.userId, !!v)}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-200">{m.userId}</TableCell>
                  <TableCell className="text-white">{m.email}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-300">
        <div>
          Page {page + 1} / {totalPages} — Total {total}
        </div>

        <div className="flex items-center gap-2">
          <select
            className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-white"
            value={String(size)}
            onChange={(e) => onSizeChange(Number(e.target.value))}
          >
            {[10, 20, 50, 100].map((s) => (
              <option key={s} value={s}>
                {s}/page
              </option>
            ))}
          </select>

          <Button variant="secondary" disabled={page <= 0} onClick={() => onPageChange(page - 1)}>
            Prev
          </Button>
          <Button variant="secondary" disabled={page + 1 >= totalPages} onClick={() => onPageChange(page + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
