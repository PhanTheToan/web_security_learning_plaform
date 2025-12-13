"use client"
import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, TooltipProps } from "recharts"
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"
import { toast } from "sonner"

interface SolvedLabsData {
  Easy?: number
  Medium?: number
  Hard?: number
  Insane?: number
}

interface ChartDataPoint {
  name: string
  value: number
}

interface PieLabelRenderProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  index: number
}

const COLORS = {
  Easy: "#22c55e", // green-500
  Medium: "#facc15", // yellow-400
  Hard: "#ef4444", // red-500
  Insane: "#a855f7", // purple-500
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  if (percent < 0.05) return null // Don't render label for very small slices

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" className="text-xs font-bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataPoint;
    return (
      <div className="bg-card/95 backdrop-blur-sm border-2 border-primary/50 p-3 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] text-white">
        <p className="label text-sm font-semibold" style={{ color: payload[0].color }}>
          {data.name}
        </p>
        <p className="intro">{`Solves: ${data.value}`}</p>
      </div>
    );
  }
  return null;
};


export function SolvedLabsChart() {
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const fetchSolvedLabs = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`${apiBaseUrl}/lab/lab-solved-level`, { credentials: "include" })
        if (!res.ok) throw new Error("Failed to fetch solved labs data.")
        const responseData = await res.json()
        const solvedData: SolvedLabsData = responseData.body
        const chartData: ChartDataPoint[] = Object.entries(solvedData)
          .map(([name, value]) => ({ name, value: Number(value) }))
          .filter((item) => item.value > 0)

        if (chartData.length === 0) {
          setData([])
        } else {
          setData(chartData)
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "An unknown error occurred.")
        setData([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchSolvedLabs()
  }, [apiBaseUrl])

  const chartColors = data.map((entry) => COLORS[entry.name as keyof typeof COLORS] || "#8884d8")

  return (
    <div className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm p-6 rounded-xl border border-[#ffffff]/10 hover:border-[#9747ff]/60 transition-all duration-300 h-full shadow-[0_0_15px_rgba(151,71,255,0.15)]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Solved Labs Distribution</h3>
          <p className="text-sm text-white/70">Breakdown by difficulty level.</p>
        </div>
      </div>
      {isLoading ? (
        <div className="h-[300px] flex items-center justify-center text-white/70">
          <p>Loading chart data...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-white/70">
          <p>No labs solved yet.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={110}
              innerRadius={50}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${entry.name}`} fill={chartColors[index % chartColors.length]} stroke={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconSize={10}
              wrapperStyle={{ color: 'white', fontSize: '12px' }}
              formatter={(value) => <span style={{ color: '#e5e7eb' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
