"use client"
import { useState, useEffect, useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps, Legend } from "recharts"
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"
import { subDays, format, parseISO, startOfDay, endOfDay } from "date-fns"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { DateRange } from "react-day-picker"

interface SolveEntry {
  completedAt: string
  labId: number
}

interface SolvedStatistics {
  solved: SolveEntry[]
  expired: SolveEntry[]
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-sm border-2 border-primary/50 p-3 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] text-white">
        <p className="label text-sm text-white/70">{label}</p>
        {payload.map((pld) => (
          <div key={pld.dataKey} style={{ color: pld.color }}>
            {`${pld.name}: ${pld.value}`}
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function LabActivityChart({ labId }: { labId: string }) {
  const [rawData, setRawData] = useState<SolvedStatistics>({ solved: [], expired: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lab/solved-statistics/${labId}`, { credentials: "include" })
        if (!res.ok) throw new Error("Failed to fetch statistics.")
        const data = await res.json()
        setRawData(data.body || { solved: [], expired: [] })
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "An unknown error occurred.")
        setRawData({ solved: [], expired: [] })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [labId])

  const chartData = useMemo(() => {
    const from = dateRange?.from
    const to = dateRange?.to
    const startDate = from ? startOfDay(from) : null
    const endDate = to ? endOfDay(to) : null

    const filterAndGroup = (entries: SolveEntry[]) => {
      const filtered = entries.filter((entry) => {
        const completedAt = parseISO(entry.completedAt)
        if (startDate && completedAt < startDate) return false
        if (endDate && completedAt > endDate) return false
        return true
      })

      return filtered.reduce(
        (acc, entry) => {
          const date = format(parseISO(entry.completedAt), "yyyy-MM-dd")
          acc[date] = (acc[date] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )
    }

    const groupedSolved = filterAndGroup(rawData.solved)
    const groupedExpired = filterAndGroup(rawData.expired)

    const allDates = new Set([...Object.keys(groupedSolved), ...Object.keys(groupedExpired)])
    const sortedDates = Array.from(allDates).sort()

    return sortedDates.map((date) => ({
      date: format(parseISO(date), "MMM d"),
      solved: groupedSolved[date] || 0,
      expired: groupedExpired[date] || 0,
    }))
  }, [rawData, dateRange])

  return (
    <div className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm p-6 rounded-xl border border-[#ffffff]/10 h-full shadow-[0_0_15px_rgba(151,71,255,0.15)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(151,71,255,0.3)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Solved vs. Expired</h3>
          <p className="text-sm text-white/70">Activity over time.</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[260px] justify-start text-left font-normal bg-white/10 text-white/90 hover:bg-white/20 hover:text-white border-white/20",
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
          <PopoverContent className="w-auto p-0 bg-gray-800/90 backdrop-blur-sm border-gray-700" align="end">
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
      {isLoading ? (
        <div className="h-[300px] flex items-center justify-center text-white/70">Loading Chart...</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.2)" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: 'white' }} />
            <Line type="monotone" name="Solved" dataKey="solved" stroke="#22c55e" strokeWidth={2} />
            <Line type="monotone" name="Expired" dataKey="expired" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
