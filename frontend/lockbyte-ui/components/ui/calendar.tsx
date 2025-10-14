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
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 text-white", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-6 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-between items-center px-2",
        caption_label: "text-sm font-medium text-white",
        caption_dropdowns: "flex gap-2 items-center",
        nav: "flex items-center gap-2",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 text-white hover:bg-white/10"
        ),
        table: "w-full border-collapse",
        head_row: "",
        head_cell:
          "text-white/70 font-normal text-[0.8rem] text-center w-9",
        row: "",
        cell:
          "h-9 w-9 text-center align-middle relative " +
          "[&:has([aria-selected])]:bg-[#9747ff]/20 " +
          "first:[&:has([aria-selected])]:rounded-l-md " +
          "last:[&:has([aria-selected])]:rounded-r-md focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal text-white hover:bg-white/10 rounded-full cursor-pointer"
        ),
        day_selected:
          "bg-[#9747ff] text-white hover:bg-[#9747ff]/90 focus:bg-[#9747ff] rounded-full",
        day_today: "bg-white/10 text-white rounded-full",
        day_outside: "text-white/50 opacity-50",
        day_disabled: "text-white/40 opacity-50",
        ...classNames,
      }}
      components={{
        Dropdown: ({ ...props }) => (
          <select
            {...props}
            className="bg-[#2c3554] border border-[#ffffff]/20 rounded-md py-1 px-2 text-white text-sm focus:ring-2 focus:ring-[#9747ff] focus:outline-none"
          >
            {props.options?.map((option) => (
              <option key={option.value} value={option.value}>
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
