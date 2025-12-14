"use client";

import type { EmailGroupMember } from "@/types/email";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Props = {
  data: EmailGroupMember[];
  loading?: boolean;
  page: number;
  size: number;
  total: number;
  onPageChange: (p: number) => void;
  onSizeChange: (s: number) => void;
  onRemove: (memberId: number) => void | Promise<void>;
};

export function MembersTable({ data, loading, page, size, total, onPageChange, onSizeChange, onRemove }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, size)));

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-white/10 bg-white/5">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="text-gray-300">ID</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">UserId</TableHead>
              <TableHead className="text-right text-gray-300">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={4} className="text-gray-300">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={4} className="text-gray-300">
                  No members found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((m) => (
                <TableRow key={m.id} className="border-white/10">
                  <TableCell className="text-gray-200">{m.id}</TableCell>
                  <TableCell className="text-white">{m.email}</TableCell>
                  <TableCell className="text-white">{m.userId ?? "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" onClick={() => onRemove(m.id)} className="text-white">
                      Remove
                    </Button>
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
