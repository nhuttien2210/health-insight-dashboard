import * as React from "react"
import { cn } from "@/libs/cn"
import { Progress as ProgressPrimitive } from "radix-ui"

function Progress({
  className,
  value,
  style,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      style={{
        backgroundColor:
          "color-mix(in oklab, var(--progress-color, var(--primary)) 20%, transparent)",
        ...style,
      }}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 transition-all"
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          backgroundColor: "var(--progress-color, var(--primary))",
        }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
