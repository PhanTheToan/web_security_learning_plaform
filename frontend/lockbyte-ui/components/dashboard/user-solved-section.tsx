"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { subDays, startOfDay, endOfDay, format, parseISO } from "date-fns";
import { SolvedLabsTable } from "@/components/dashboard/solved-labs-table";
import { toast } from "sonner";
import { UserLabsActivityChart } from "./userlabs-activity-chart";
import { SolveVsErrorMiniChart } from "./solve-vs-error-mini-chart";

type LabItem = {
    labName: string;
    difficulty: string;
    completedAt: string; // ISO
    labId: number;
    errorCount: number;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL as string;

export function UserSolvedSection({
    labs: labsProp,
    loading: loadingProp = false,
}: {
    labs?: LabItem[];
    loading?: boolean;
}) {
    const [labs, setLabs] = useState<LabItem[]>(labsProp ?? []);
    const [isLoading, setIsLoading] = useState<boolean>(loadingProp);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 30),
        to: new Date(),
    });

    // nếu parent không truyền labs thì tự fetch
    useEffect(() => {
        if (labsProp) return;
        const load = async () => {
            setIsLoading(true);
            try {
                if (!apiBaseUrl) throw new Error("Missing NEXT_PUBLIC_API_URL");
                const res = await fetch(`${apiBaseUrl}/user/labs`, { credentials: "include", cache: "no-store" });
                if (!res.ok) throw new Error("Failed to fetch /user/labs");
                const data = await res.json();
                setLabs(Array.isArray(data) ? data : (data?.body ?? []));
            } catch (e: any) {
                console.error(e);
                toast.error(e?.message || "Failed to load solved labs.");
                setLabs([]);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [labsProp]);

    // đồng bộ khi parent đổi labs
    useEffect(() => {
        if (labsProp) setLabs(labsProp);
    }, [labsProp]);

    useEffect(() => {
        setIsLoading(loadingProp);
    }, [loadingProp]);

    const filtered = useMemo(() => {
        if (!dateRange?.from && !dateRange?.to) return labs;
        const from = dateRange?.from ? startOfDay(dateRange.from) : null;
        const to = dateRange?.to ? endOfDay(dateRange.to) : null;
        return labs.filter((x) => {
            const t = parseISO(x.completedAt);
            if (from && t < from) return false;
            if (to && t > to) return false;
            return true;
        });
    }, [labs, dateRange]);

    const totalSolved = filtered.length;
    const totalErrors = filtered.reduce((a, b) => a + (Number(b.errorCount) || 0), 0);

    return (
        <div className="space-y-6 text-white">
            {/* Filter */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h3 className="text-lg font-semibold">Solved Analytics</h3>
                    <p className="text-sm text-white/70">Select a date range to view your activity and stats.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                    "w-[280px] justify-start text-left font-normal bg-white/10 text-white/90 hover:bg-white/20 hover:text-white border-white/20",
                                    !dateRange && "text-white/70"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange?.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(dateRange.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date range</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto bg-gray-800/90 p-0 backdrop-blur-sm" align="end">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Row 1: Chart + Mini chart */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-transparent border-white/10 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-white">Solved Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-[320px] w-full" /> : <UserLabsActivityChart labs={filtered} />}
                    </CardContent>
                </Card>

                <Card className="bg-transparent border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white">Correct vs Errors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-[320px] w-full" />
                        ) : (
                            <SolveVsErrorMiniChart totalSolved={totalSolved} totalErrors={totalErrors} />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Row 2: Table */}
            <Card className="bg-transparent border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">Solved Labs (Newest → Oldest)</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-[300px] w-full" /> : <SolvedLabsTable solvedLabs={filtered} />}
                </CardContent>
            </Card>
        </div>
    );
}
