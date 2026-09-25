import type { MetricAccent } from '@/types/metric'
import { Progress } from '@/components/ui/progress'
import { ACCENT_COLOR } from '@/constants/chart'
import { cn } from '@/libs/cn'

type ProgressStatProps = {
  label: string
  
  valueLabel: string
  percent: number
  accent?: MetricAccent
  hint?: string
  className?: string
}

export function ProgressStat({
  label,
  valueLabel,
  percent,
  accent,
  hint,
  className,
}: ProgressStatProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground tabular-nums">{valueLabel}</span>
      </div>
      <Progress
        value={percent}
        aria-label={`${label}: ${valueLabel}`}
        style={accent ? { ['--progress-color' as string]: ACCENT_COLOR[accent] } : undefined}
      />
      {hint ? <p className="text-muted-foreground text-xs">{hint}</p> : null}
    </div>
  )
}
