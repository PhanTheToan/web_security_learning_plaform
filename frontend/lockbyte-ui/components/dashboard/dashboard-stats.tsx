"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type DashboardData = {
    fullName?: string;
    totalEasy: number;
    totalMedium: number;
    totalHard: number;
    totalInsane: number;
    totalSolvedEasy: number;
    totalSolvedMedium: number;
    totalSolvedHard: number;
    totalSolvedInsane: number;
    percentSolved: number;
    proficiencyLevel?: string;
};

function pct(solved: number, total: number) {
    if (!total || total <= 0) return 0;
    const p = (solved / total) * 100;
    return Number.isFinite(p) ? Math.max(0, Math.min(100, +p.toFixed(1))) : 0;
}

function levelColor(level: "Easy" | "Medium" | "Hard" | "Insane") {
    switch (level) {
        case "Easy":
            return { ring: "from-emerald-500" };
        case "Medium":
            return { ring: "from-amber-400" };
        case "Hard":
            return { ring: "from-rose-500" };
        case "Insane":
            return { ring: "from-violet-500" };
    }
}

function overallColors(percent: number) {
    if (percent < 30) return { bar: "bg-rose-500", text: "text-rose-400", label: "Beginner" };
    if (percent <= 70) return { bar: "bg-amber-400", text: "text-amber-300", label: "Intermediate" };
    return { bar: "bg-emerald-500", text: "text-emerald-300", label: "Advanced" };
}

function Ring({ percent, colorFrom, label }: { percent: number; colorFrom: string; label: string }) {
    const angle = Math.round((percent / 100) * 360);
    const style = { background: `conic-gradient(var(--tw-gradient-from) ${angle}deg, rgba(255,255,255,0.08) ${angle}deg)` } as React.CSSProperties;

    return (
        <div className="flex items-center gap-4">
            <div className={`h-16 w-16 rounded-full bg-gradient-to-tr ${colorFrom}`} style={style}>
                <div className="m-[6px] flex h-[calc(100%-12px)] w-[calc(100%-12px)] items-center justify-center rounded-full bg-[#0b0f17]">
                    <span className="text-sm font-semibold text-white">{percent.toFixed(0)}%</span>
                </div>
            </div>
            <div className="leading-tight">
                <div className="text-sm text-white/70">{label}</div>
            </div>
        </div>
    );
}

export function DashboardStats({ data }: { data: DashboardData }) {
    const { totalEasy, totalMedium, totalHard, totalInsane, totalSolvedEasy, totalSolvedMedium, totalSolvedHard, totalSolvedInsane } = data;

    const easyPct = pct(totalSolvedEasy, totalEasy);
    const medPct = pct(totalSolvedMedium, totalMedium);
    const hardPct = pct(totalSolvedHard, totalHard);
    const insanePct = pct(totalSolvedInsane, totalInsane);

    const overall = Number.isFinite(data.percentSolved) ? Math.max(0, Math.min(100, +data.percentSolved)) : 0;
    const overallUI = overallColors(overall);
    const shownLevel = data.proficiencyLevel ?? (overall < 30 ? "Beginner" : overall <= 70 ? "Intermediate" : "Advanced");

    return (
        <div className="grid gap-6 lg:grid-cols-5">
            <Card className="glass-card hover:glass-card-hover transition-all duration-300 rounded-2xl lg:col-span-3">
                <CardHeader>
                    <CardTitle className="text-white">Level Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Ring percent={easyPct} colorFrom={levelColor("Easy").ring} label={`Easy: ${totalSolvedEasy}/${totalEasy}`} />
                        <Ring percent={medPct} colorFrom={levelColor("Medium").ring} label={`Medium: ${totalSolvedMedium}/${totalMedium}`} />
                        <Ring percent={hardPct} colorFrom={levelColor("Hard").ring} label={`Hard: ${totalSolvedHard}/${totalHard}`} />
                        <Ring percent={insanePct} colorFrom={levelColor("Insane").ring} label={`Insane: ${totalSolvedInsane}/${totalInsane}`} />
                    </div>
                </CardContent>
            </Card>

            <Card className="glass-card hover:glass-card-hover transition-all duration-300 rounded-2xl lg:col-span-2">
                <CardHeader>
                    <CardTitle className="text-white">Overall Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-baseline justify-between">
                        <div className="text-sm text-white/70">Solved</div>
                        <div className="text-xl font-semibold text-white">{overall.toFixed(1)}%</div>
                    </div>
                    <Progress value={overall} className={`h-3 bg-white/10 [&>div]:${overallUI.bar}`} />
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-white/60">0%</span>
                        <span className="text-xs text-white/60">100%</span>
                    </div>
                    <div className="pt-2 text-sm">
                        <span className="text-white/70">Proficiency: </span>
                        <span className={`font-medium ${overallUI.text}`}>{shownLevel}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default DashboardStats;