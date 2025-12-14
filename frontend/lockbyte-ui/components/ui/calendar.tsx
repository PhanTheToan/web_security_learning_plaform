"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const navBtn = cn(
    buttonVariants({ variant: "outline" }),
    "h-8 w-8 bg-transparent p-0 text-white/80 border-white/10 " +
      "hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#9747ff]/50"
  )

  const dayBtn = cn(
    buttonVariants({ variant: "ghost" }),
    "h-9 w-9 p-0 font-normal text-white rounded-full " +
      "hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#9747ff]/50 " +
      "aria-disabled:opacity-40 aria-disabled:cursor-not-allowed"
  )

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 text-white", className)}
      classNames={{
        months: "relative flex flex-col sm:flex-row gap-4",
        month: "w-full sm:w-[280px] space-y-3",

   
        month_caption: "flex items-center justify-center pt-1 relative",
        caption_label: "text-sm font-medium text-white",

       
        nav: "absolute right-2 top-2 flex items-center gap-1",
        button_previous: navBtn,
        button_next: navBtn,

        month_grid: "w-full border-collapse table-fixed",
        weekdays: "",
        weekday:
          "w-9 text-center text-[0.8rem] font-normal text-white/60 select-none",
        weeks: "",
        week: "",

        day: "w-9 h-9 p-0 text-center align-middle",
        day_button: dayBtn,

        ...classNames,
      }}
      modifiersClassNames={{
        selected:
          "[&>button]:bg-[#9747ff] [&>button]:text-white [&>button]:hover:bg-[#9747ff]/90",
        today:
          "[&>button]:bg-white/10 [&>button]:text-white [&>button]:hover:bg-white/15",
        outside: "opacity-50 [&>button]:text-white/60",
        disabled: "opacity-40 [&>button]:opacity-40",

        range_middle:
          "bg-[#9747ff]/15 rounded-none [&>button]:bg-transparent [&>button]:hover:bg-transparent [&>button]:rounded-none",
        range_start:
          "bg-[#9747ff]/15 rounded-l-full [&>button]:bg-[#9747ff] [&>button]:text-white",
        range_end:
          "bg-[#9747ff]/15 rounded-r-full [&>button]:bg-[#9747ff] [&>button]:text-white",
      }}
      components={{
        Dropdown: (
          p: React.ComponentProps<"select"> & {
            options?: { value: string | number; label: string }[]
          }
        ) => (
          <select
            {...p}
            className="bg-[#2c3554] border border-white/15 rounded-md py-1 px-2 text-white text-sm
                       focus:ring-2 focus:ring-[#9747ff]/60 focus:outline-none"
          >
            {p.options?.map((option) => (
              <option key={option.value} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        ),
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  )
}
