"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

type ProgressProps = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  /** giá trị % 0..100 */
  value?: number;
};

function colorFor(value = 0) {
  const v = Math.max(0, Math.min(100, value));
  if (v < 25) return "bg-rose-500";        // <25%
  if (v < 50) return "bg-amber-400";       // 25-50
  if (v < 75) return "bg-sky-400";         // 50-75
  return "bg-emerald-500";                 // 75-100
}

export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, ...props }, ref) => {
  const barColor = colorFor(value);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      // Track: xám nhẹ để nổi bật phần đạt
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-white/10",
        // nếu bạn muốn dùng token sẵn có: thay bằng "bg-secondary"
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        // Bar: đổi màu theo ngưỡng, có animation mượt
        className={cn(
          "h-full w-full flex-1 transition-transform duration-300 ease-out",
          barColor
        )}
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});

Progress.displayName = ProgressPrimitive.Root.displayName;

