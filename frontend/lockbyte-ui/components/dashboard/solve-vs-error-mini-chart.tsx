"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell } from "recharts";

export function SolveVsErrorMiniChart({ totalSolved, totalErrors }: { totalSolved: number; totalErrors: number }) {
    const data = [
        { name: "Correct", value: totalSolved },
        { name: "Errors", value: totalErrors },
    ];

    return (
        <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barSize={40} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.2)" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "rgba(17,24,39,0.9)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            color: "#fff",
                        }}
                    />
                    <Legend wrapperStyle={{ color: "white" }} />
                    <Bar dataKey="value" name="Count">
                        {data.map((entry) => (
                            <Cell key={entry.name} fill={entry.name === "Correct" ? "#22c55e" : "#ef4444"} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
