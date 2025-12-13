"use client"
import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, TooltipProps } from "recharts"
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"
import { toast } from "sonner"

interface StatusData {
  Running: number
  Expired: number
  Solved: number
}

interface ChartDataPoint {
  name: string
  value: number
}

const COLORS = {
  Solved: "#22c55e",
  Expired: "#ef4444",
  Running: "#facc15",
}

const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataPoint
    return (
      <div className="bg-card/95 backdrop-blur-sm border-2 border-primary/50 p-3 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] text-white">
        <p className="label text-sm font-semibold" style={{ color: payload[0].color }}>
          {`${data.name}: ${data.value}`}
        </p>
      </div>
    )
  }
  return null
}

export function LabStatusPieChart({ labId }: { labId: string }) {
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lab/solved-status/${labId}`, { credentials: "include" })
        if (!res.ok) throw new Error("Failed to fetch status data.")
        const responseData = await res.json()
        const statusData: StatusData = responseData.body
        const chartData: ChartDataPoint[] = Object.entries(statusData).map(([name, value]) => ({ name, value: Number(value) }))
        setData(chartData)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "An unknown error occurred.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [labId])

  return (
    <div className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm p-6 rounded-xl border border-[#ffffff]/10 h-full shadow-[0_0_15px_rgba(151,71,255,0.15)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(151,71,255,0.3)]">
      <h3 className="text-lg font-semibold text-white mb-4">Lab Status Overview</h3>
      {isLoading ? (
        <div className="h-[300px] flex items-center justify-center text-white/70">Loading Chart...</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: 'white' }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
