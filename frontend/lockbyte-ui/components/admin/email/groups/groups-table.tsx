"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { EmailGroup } from "@/types/email";

type Props = {
  data: EmailGroup[];
  loading?: boolean;
  page: number;
  size: number;
  total: number;
  onPageChange: (p: number) => void;
  onSizeChange: (s: number) => void;

  onEdit: (g: EmailGroup) => void;
  onDelete: (g: EmailGroup) => void;
  onManageMembers: (g: EmailGroup) => void;
};

export function GroupsTable({
  data,
  loading,
  page,
  size,
  total,
  onPageChange,
  onSizeChange,
  onEdit,
  onDelete,
  onManageMembers,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, size)));

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-white/10 bg-white/5">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="text-gray-300">ID</TableHead>
              <TableHead className="text-gray-300">Name</TableHead>
              <TableHead className="text-gray-300">Description</TableHead>
              <TableHead className="text-gray-300">Members</TableHead>
              <TableHead className="text-right text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={5} className="text-gray-300">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={5} className="text-gray-300">
                  No groups found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((g) => (
                <TableRow key={g.id} className="border-white/10">
                  <TableCell className="text-gray-200">{g.id}</TableCell>
                  <TableCell className="text-white">{g.name}</TableCell>
                  <TableCell className="text-gray-300">{g.description ?? "-"}</TableCell>
                  <TableCell className="text-gray-200">{typeof g.memberCount === "number" ? g.memberCount : "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-2">
                      <Button variant="secondary" onClick={() => onManageMembers(g)} className="text-white">
                        Members
                      </Button>
                      <Button variant="outline" onClick={() => onEdit(g)} className="text-white">
                        Edit
                      </Button>
                      <Button variant="destructive" onClick={() => onDelete(g)} className="text-white">
                        Delete
                      </Button>
                    </div>
                  </TableCell>
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

          <Button variant="secondary" disabled={page <= 0} onClick={() => onPageChange(page - 1)} className="text-white">
            Prev
          </Button>
          <Button variant="secondary" disabled={page + 1 >= totalPages} onClick={() => onPageChange(page + 1)} className="text-white">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
