"use client";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
    TooltipProps,
} from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

export function SolveVsErrorMiniChart({
    totalSolved,
    totalErrors,
}: {
    totalSolved: number;
    totalErrors: number;
}) {
    const data = [
        { name: "Solved", value: Number(totalSolved) || 0 },
        { name: "Errors", value: Number(totalErrors) || 0 },
    ];

    const COLORS = ["#22c55e", "#ef4444"]; // xanh lá / đỏ

    const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
        if (active && payload && payload.length) {
            const p = payload[0];
            return (
                <div className="bg-[rgba(10,14,22,0.95)] text-white border border-white/20 px-3 py-2 rounded-md shadow-lg">
                    <div className="text-sm">
                        <span style={{ color: p.color as string }} className="font-medium">
                            {String(p.name)}
                        </span>
                        : <span className="font-semibold">{p.value as number}</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Hiển thị phần trăm ngay trên lát cắt
    const renderLabel = (entry: any) => {
        const total = data.reduce((s, d) => s + d.value, 0);
        if (!total) return "";
        const pct = Math.round((entry.value / total) * 100);
        // Ẩn nhãn = 0%
        return pct > 0 ? `${pct}%` : "";
    };

    return (
        <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        label={renderLabel}
                        labelLine={false}
                    >
                        {data.map((entry, idx) => (
                            <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} stroke="none" />
                        ))}
                    </Pie>

                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        wrapperStyle={{ color: "#fff" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
