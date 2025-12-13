"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes";

interface SolvedLab {
  completedAt: string;
}

interface SolvedLabsChartProps {
  solvedLabs: SolvedLab[];
}

export function SolvedLabsChart({ solvedLabs }: SolvedLabsChartProps) {
  const { theme } = useTheme();

  const data = solvedLabs.reduce((acc, lab) => {
    const month = new Date(lab.completedAt).toLocaleString("default", { month: "short", year: "numeric" });
    const existingMonth = acc.find((item) => item.month === month);
    if (existingMonth) existingMonth.count += 1; else acc.push({ month, count: 1 });
    return acc;
  }, [] as { month: string; count: number }[]);

  return (
    <div className="rounded-xl border border-white/10 p-4 glass-card hover:glass-card-hover transition-all duration-300">
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.2)" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: theme === "dark" ? "#0b0f17" : "#fff", borderColor: theme === "dark" ? "#555" : "#ccc" }} labelStyle={{ color: theme === "dark" ? "#e5e7eb" : "#111" }} />
            <Legend wrapperStyle={{ color: "white" }} />
            <Bar dataKey="count" name="Labs Solved" fill="#a855f7" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
