"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface SolvedLab {
  labId: number;
  labName: string;
  difficulty: string;
  completedAt: string;
  errorCount: number;
}

interface SolvedLabsTableProps {
  solvedLabs: SolvedLab[];
}

function difficultyClass(difficulty: string) {
  switch ((difficulty || "").toLowerCase()) {
    case "easy":
      return "label-level-easy";
    case "medium":
      return "label-level-medium";
    case "hard":
      return "label-level-hard";
    case "insane":
      return "label-level-insane";
    default:
      return "label-level-unknown";
  }
}

export function SolvedLabsTable({ solvedLabs }: SolvedLabsTableProps) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const sortedLabs = [...solvedLabs].sort((a, b) => {
    const dateA = new Date(a.completedAt).getTime();
    const dateB = new Date(b.completedAt).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const toggleSortOrder = () => setSortOrder(sortOrder === "asc" ? "desc" : "asc");

  return (
    <div className="rounded-2xl overflow-hidden border border-[#ffffff]/10 
  bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 
  backdrop-blur-sm hover:border-[#9747ff]/40 transition-all duration-300"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-white/10 border-b border-white/10">
            <TableHead className="text-white font-semibold">Lab Name</TableHead>
            <TableHead className="text-white font-semibold">Difficulty</TableHead>
            <TableHead className="text-white font-semibold">
              <Button
                variant="ghost"
                onClick={toggleSortOrder}
                className="text-white font-semibold hover:bg-white/10"
              >
                Completed At
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-white font-semibold">Error Count</TableHead>
          </TableRow>
        </TableHeader>


        <TableBody>
          {sortedLabs.map((lab, index) => (
            <TableRow
              key={lab.labId}
              className={`border-b border-white/10 text-white/80 transition-colors ${
                index % 2 === 0 ? "bg-white/0 hover:bg-white/5" : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <TableCell className="py-3">{lab.labName}</TableCell>
              <TableCell className="py-3">
                <span className={difficultyClass(lab.difficulty)}>{lab.difficulty}</span>
              </TableCell>
              <TableCell className="py-3">
                {new Date(lab.completedAt).toLocaleString('en-GB')}
              </TableCell>
              <TableCell className="py-3">{lab.errorCount}</TableCell>
            </TableRow>
          ))}

          {sortedLabs.length === 0 && (
            <TableRow className="border-t border-white/10">
              <TableCell colSpan={4} className="py-6 text-center text-white/70">
                No labs in this range.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
