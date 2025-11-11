"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SolvedLabsTable({ solvedLabs }) {
  const [sortOrder, setSortOrder] = useState("desc");

  const sortedLabs = [...solvedLabs].sort((a, b) => {
    const dateA = new Date(a.completedAt);
    const dateB = new Date(b.completedAt);
    if (sortOrder === "asc") {
      return dateA - dateB;
    }
    return dateB - dateA;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "hard":
        return "bg-red-500";
      case "insane":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Lab Name</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead>
            <Button variant="ghost" onClick={toggleSortOrder}>
              Completed At
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>Error Count</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedLabs.map((lab) => (
          <TableRow key={lab.labId}>
            <TableCell>{lab.labName}</TableCell>
            <TableCell>
              <Badge className={getDifficultyBadge(lab.difficulty)}>
                {lab.difficulty}
              </Badge>
            </TableCell>
            <TableCell>{new Date(lab.completedAt).toLocaleDateString()}</TableCell>
            <TableCell>{lab.errorCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
