import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// màu rõ ràng theo level
const levelColor: Record<string, string> = {
    Easy: "#22c55e",    // green-500
    Medium: "#facc15",  // yellow-400
    Hard: "#ef4444",    // red-500
    Insane: "#a855f7",  // purple-500
};

const Ring = ({
    title,
    solved,
    total,
    color,
}: {
    title: string;
    solved: number;
    total: number;
    color: string;
}) => {
    const percentage = total > 0 ? (solved / total) * 100 : 0;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <Card className="bg-transparent border-white/10">
            <CardHeader>
                <CardTitle className="text-white">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-white">
                <div className="relative h-24 w-24">
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                        <circle
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="10"
                            fill="transparent"
                            r="45"
                            cx="50"
                            cy="50"
                        />
                        <circle
                            stroke={color}
                            strokeWidth="10"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            fill="transparent"
                            r="45"
                            cx="50"
                            cy="50"
                            transform="rotate(-90 50 50)"
                        />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                        {Math.round(percentage)}%
                    </span>
                </div>
                <div className="mt-2 text-center">
                    <p className="text-lg font-semibold">
                        {solved} / {total}
                    </p>
                    <p className="text-sm text-white/60">Solved</p>
                </div>
            </CardContent>
        </Card>
    );
};

export function DashboardStats({ data }: { data: any }) {
    const {
        totalEasy,
        totalMedium,
        totalHard,
        totalInsane,
        totalSolvedEasy,
        totalSolvedMedium,
        totalSolvedHard,
        totalSolvedInsane,
        percentSolved,
    } = data;

    const computedLevel =
        percentSolved < 30.0 ? "Beginner" : percentSolved <= 70.0 ? "Intermediate" : "Advanced";

    return (
        <div className="text-white">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Ring title="Easy" solved={totalSolvedEasy} total={totalEasy} color={levelColor.Easy} />
                <Ring title="Medium" solved={totalSolvedMedium} total={totalMedium} color={levelColor.Medium} />
                <Ring title="Hard" solved={totalSolvedHard} total={totalHard} color={levelColor.Hard} />
                <Ring title="Insane" solved={totalSolvedInsane} total={totalInsane} color={levelColor.Insane} />
            </div>

            <Card className="mt-4 bg-transparent border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">Overall Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <span className="min-w-[3ch] text-right font-semibold">{Math.round(percentSolved)}%</span>
                        <Progress value={percentSolved} className="w-full" />
                        <span className="ml-4 rounded-md border border-white/20 bg-white/10 px-2 py-1 text-sm">
                            Level: {computedLevel}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
