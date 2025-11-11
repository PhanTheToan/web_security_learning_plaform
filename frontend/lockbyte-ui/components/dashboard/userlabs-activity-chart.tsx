"use client";

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, TooltipProps
} from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { format, parseISO } from "date-fns";

type LabItem = {
    labName: string;
    difficulty: string;
    completedAt: string; // ISO
    labId: number;
    errorCount: number;
};

type ChartPoint = { dateLabel: string; solved: number };

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card/95 backdrop-blur-sm border-2 border-primary/50 p-3 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] text-white">
                <p className="label text-sm text-white/70">{label}</p>
                {payload.map((pld) => (
                    <div key={pld.dataKey as string} style={{ color: pld.color as string }}>
                        {`${pld.name}: ${pld.value}`}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export function UserLabsActivityChart({ labs }: { labs: LabItem[] }) {
    // Gom ngày an toàn
    const grouped = labs.reduce((acc: Record<string, number>, item) => {
        if (!item?.completedAt) return acc;
        const d = parseISO(item.completedAt);
        if (isNaN(+d)) return acc;
        const key = format(d, "yyyy-MM-dd");
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const data: ChartPoint[] = Object.entries(grouped)
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([yyyyMMdd, count]) => ({
            dateLabel: format(parseISO(yyyyMMdd), "MMM d"), // hiển thị
            solved: count as number,
        }));

    return (
        <div className="h-[320px]">
            {data.length === 0 ? (
                <div className="flex h-full w-full items-center justify-center text-white/70">
                    No data available for this period.
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.2)" />
                        <XAxis dataKey="dateLabel" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ color: "white" }} />
                        <Line
                            type="monotone"
                            name="Solved"
                            dataKey="solved"
                            stroke="#22c55e"
                            strokeWidth={3}
                            dot={{ r: 3, fill: "#22c55e" }}
                            activeDot={{ r: 6, fill: "#22c55e" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
