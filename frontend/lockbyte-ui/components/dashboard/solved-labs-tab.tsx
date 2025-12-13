"use client";

import { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { SolvedLabsChart } from "./solved-labs-chart";
import { SolvedLabsTable } from "./solved-labs-table";
import { Label } from "@/components/ui/label";

interface SolvedLab {
  labId: number;
  labName: string;
  difficulty: string;
  completedAt: string;
  errorCount: number;
}

interface SolvedLabsTabProps {
  solvedLabs: SolvedLab[];
}

export function SolvedLabsTab({ solvedLabs }: SolvedLabsTabProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().setFullYear(new Date().getFullYear() - 1))
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const filteredLabs = solvedLabs.filter((lab) => {
    const completedAt = new Date(lab.completedAt);
    if (!startDate || !endDate) return true;
    return completedAt >= startDate && completedAt <= endDate;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-4">
        <div className="flex flex-col gap-2">
            <Label>From</Label>
            <DatePicker
            value={startDate}
            onChange={setStartDate}
            />
        </div>
        <div className="flex flex-col gap-2">
            <Label>To</Label>
            <DatePicker
            value={endDate}
            onChange={setEndDate}
            />
        </div>
      </div>
      <SolvedLabsChart solvedLabs={filteredLabs} />
      <SolvedLabsTable solvedLabs={filteredLabs} />
    </div>
  );
}
