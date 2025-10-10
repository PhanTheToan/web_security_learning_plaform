"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Day 1", solves: 40 },
  { name: "Day 2", solves: 30 },
  { name: "Day 3", solves: 50 },
  { name: "Day 4", solves: 45 },
  { name: "Day 5", solves: 60 },
  { name: "Day 6", solves: 70 },
  { name: "Day 7", solves: 90 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-sm border-2 border-primary/50 p-3 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)]">
        <p className="label text-sm text-white/70">{`${label}`}</p>
        <p className="intro text-white font-bold">{`Solves : ${payload[0].value}`}</p>
      </div>
    )
  }

  return null
}

export function ActivityChart() {
  return (
    <div className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm p-6 rounded-xl border border-[#ffffff]/10 hover:border-[#9747ff]/60 hover:from-[#9747ff]/10 hover:via-[#5a5bed]/8 hover:to-[#821db6]/10 transition-all duration-500 h-full hover:shadow-[0_0_30px_rgba(151,71,255,0.2)] hover:scale-[1.02]">
      <h3 className="text-lg font-semibold text-white mb-4">Lab Solves in Last 7 Days</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.2)" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="solves"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{
              r: 5,
              fill: "hsl(var(--primary))",
              stroke: "hsl(var(--background))",
              strokeWidth: 2,
            }}
            activeDot={{ r: 8, fill: "hsl(var(--primary))", filter: "drop-shadow(0 0 8px hsl(var(--primary)))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
