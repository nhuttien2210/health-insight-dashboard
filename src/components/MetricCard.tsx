import type { LucideIcon } from 'lucide-react'
import type { MetricAccent, ProgressTone, Trend } from '@/types/metric'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Sparkline } from './Sparkline'
import { StatusBadge } from './StatusBadge'
import { TrendPill } from './TrendPill'
import { ACCENT_COLOR, accentSurface } from '@/constants/chart'
import { cn } from '@/libs/cn'

type MetricCardProps = {
  label: string
  icon: LucideIcon
  accent: MetricAccent
  value: string
  unit?: string
  trend: Trend
  comparisonLabel: string
  higherIsBetter: boolean
  progress?: { percent: number; label: string }
  sparkline?: number[]
  tone?: ProgressTone
  className?: string
}

export function MetricCard({
  label,
  icon: Icon,
  accent,
  value,
  unit,
  trend,
  comparisonLabel,
  higherIsBetter,
  progress,
  sparkline,
  tone,
  className,
}: MetricCardProps) {
  const color = ACCENT_COLOR[accent]

  return (
    <Card className={cn('gap-3 py-4', className)}>
      <CardHeader className="gap-0 px-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
            <span
              className="flex size-7 items-center justify-center rounded-lg"
              style={{ backgroundColor: accentSurface(accent, 16), color }}
            >
              <Icon className="size-4" aria-hidden />
            </span>
            {label}
          </CardTitle>
          {tone ? <StatusBadge tone={tone} /> : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-2 px-4">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl leading-none font-semibold tabular-nums">{value}</span>
          {unit ? <span className="text-muted-foreground text-sm">{unit}</span> : null}
        </div>

        <TrendPill trend={trend} comparisonLabel={comparisonLabel} higherIsBetter={higherIsBetter} />

        {progress ? (
          <div className="space-y-1 pt-1">
            <Progress
              value={progress.percent}
              aria-label={progress.label}
              style={{ ['--progress-color' as string]: color }}
            />
            <p className="text-muted-foreground text-xs">{progress.label}</p>
          </div>
        ) : null}

        {sparkline && sparkline.length > 1 ? (
          <Sparkline data={sparkline} color={color} ariaLabel={`${label} trend over the selected period`} />
        ) : null}
      </CardContent>
    </Card>
  )
}
