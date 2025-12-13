"use client";

import { useMemo, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, TooltipProps
} from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";

type LabItem = {
    labName: string;
    difficulty: string;
    completedAt: string; // ISO
    labId: number;
    errorCount: number;
};

type ChartPoint = { dateKey: string; dateLabel: string; solved: number };
type Mode = "daily" | "cumulative";

const AXIS = { stroke: "rgba(255,255,255,0.7)" };
const GRID = { stroke: "rgba(255,255,255,0.15)" };

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[rgba(10,14,22,0.95)] backdrop-blur-sm border border-white/20 p-3 rounded-xl text-white shadow-lg">
                <p className="label text-sm text-white/80">{label}</p>
                {payload.map((pld) => (
                    <div key={String(pld.dataKey)} style={{ color: String(pld.color) }}>
                        {`${pld.name}: ${pld.value}`}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export function UserLabsActivityChart({ labs }: { labs: LabItem[] }) {
    const [mode, setMode] = useState<Mode>("daily");

    // Gom theo ngày: đếm solved mỗi ngày
    const daily: ChartPoint[] = useMemo(() => {
        const grouped = labs.reduce((acc: Record<string, number>, item) => {
            if (!item?.completedAt) return acc;
            const d = parseISO(item.completedAt);
            if (isNaN(+d)) return acc;
            const key = format(d, "yyyy-MM-dd");
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(grouped)
            .sort()
            .map((k) => ({
                dateKey: k,
                dateLabel: format(parseISO(k), "MMM d"),
                solved: grouped[k],
            }));
    }, [labs]);

    // Lũy kế theo thời gian
    const cumulative: ChartPoint[] = useMemo(() => {
        let running = 0;
        return daily.map((pt) => {
            running += pt.solved;
            return { ...pt, solved: running };
        });
    }, [daily]);

    const data = mode === "daily" ? daily : cumulative;

    const hasData = data.length > 0;

    return (
        <div className="h-[420px] glass-card hover:glass-card-hover transition-all duration-300 rounded-2xl p-4">
            <div className="mb-2 flex items-center justify-between">
                <CardDescription className="text-white/70">
                    {mode === "daily" ? "Daily solved count" : "Cumulative solved over time"}
                </CardDescription>
                <div className="inline-flex gap-2">
                    <Button
                        size="sm"
                        variant={mode === "daily" ? "default" : "outline"}
                        className={mode === "daily" ? "bg-white/20 text-white hover:bg-white/30 rounded-2xl" : "bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-2xl"}
                        onClick={() => setMode("daily")}
                    >
                        Daily
                    </Button>
                    <Button
                        size="sm"
                        variant={mode === "cumulative" ? "default" : "outline"}
                        className={mode === "cumulative" ? "bg-white/20 text-white hover:bg-white/30 rounded-2xl" : "bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-2xl"}
                        onClick={() => setMode("cumulative")}
                    >
                        Cumulative
                    </Button>
                </div>
            </div>

            {!hasData ? (
                <div className="flex h-[280px] w-full items-center justify-center text-white/70">
                    No data available for this period.
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={GRID.stroke} />
                        <XAxis dataKey="dateLabel" stroke={AXIS.stroke} tick={{ fill: "#fff" }} fontSize={12} />
                        <YAxis stroke={AXIS.stroke} tick={{ fill: "#fff" }} fontSize={12} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ color: "#fff" }} />
                        <Line
                            type="monotone"
                            name={mode === "daily" ? "Solved (daily)" : "Solved (cumulative)"}
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
