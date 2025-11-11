"use client";

import { useState } from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { SolvedLabsChart } from "./solved-labs-chart";
import { SolvedLabsTable } from "./solved-labs-table";

export function SolvedLabsTab({ solvedLabs }) {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    to: new Date(),
  });

  const filteredLabs = solvedLabs.filter((lab) => {
    const completedAt = new Date(lab.completedAt);
    return completedAt >= dateRange.from && completedAt <= dateRange.to;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
        />
      </div>
      <SolvedLabsChart solvedLabs={filteredLabs} />
      <SolvedLabsTable solvedLabs={filteredLabs} />
    </div>
  );
}
