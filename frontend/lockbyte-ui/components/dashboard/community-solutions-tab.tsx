"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// --- Type definitions
interface CommunitySolution {
  id: number;
  labId: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  writeup?: string;
  youtubeUrl?: string;
  feedback?: string;
}

interface CommunitySolutionsTabProps {
  solutions: CommunitySolution[];
}

function statusClass(status: string) {
  switch ((status || "").toLowerCase()) {
    case "approved":
      return "bg-green-500/20 text-green-300 border border-green-500/30";
    case "pending":
      return "bg-amber-400/20 text-amber-200 border border-amber-300/30";
    case "rejected":
      return "bg-rose-500/20 text-rose-300 border border-rose-500/30";
    default:
      return "bg-white/10 text-white/80 border border-white/20";
  }
}

export function CommunitySolutionsTab({ solutions }: CommunitySolutionsTabProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden border border-[#ffffff]/10 
  bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 
  backdrop-blur-sm hover:border-[#9747ff]/40 transition-all duration-30"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-white/10 border-b border-white/10">
            <TableHead className="text-white font-semibold">Lab ID</TableHead>
            <TableHead className="text-white font-semibold">Status</TableHead>
            <TableHead className="text-white font-semibold">Writeup</TableHead>
            <TableHead className="text-white font-semibold">YouTube URL</TableHead>
            <TableHead className="text-white font-semibold">Admin Feedback</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {solutions.map((solution, index) => (
            <TableRow
              key={solution.id}
              className={`border-b border-white/10 text-white/80 transition-colors ${
                index % 2 === 0 ? "bg-white/0 hover:bg-white/5" : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <TableCell className="py-3">{solution.labId}</TableCell>
              <TableCell className="py-3">
                <Badge
                  className={`rounded-full px-2.5 py-1 text-xs ${statusClass(solution.status)}`}
                >
                  {solution.status}
                </Badge>
              </TableCell>
              <TableCell className="py-3">
                {solution.writeup ? (
                  <Link
                    href={solution.writeup}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline underline-offset-4"
                  >
                    View Writeup
                  </Link>
                ) : (
                  <span className="text-white/60">N/A</span>
                )}
              </TableCell>
              <TableCell className="py-3">
                {solution.youtubeUrl ? (
                  <Link
                    href={solution.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline underline-offset-4"
                  >
                    Watch Video
                  </Link>
                ) : (
                  <span className="text-white/60">N/A</span>
                )}
              </TableCell>
              <TableCell className="py-3 text-sm text-white/80">
                {solution.feedback || <span className="text-white/60">N/A</span>}
              </TableCell>
            </TableRow>
          ))}

          {solutions.length === 0 && (
            <TableRow className="border-t border-white/10">
              <TableCell colSpan={5} className="py-6 text-center text-white/70">
                No community solutions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
