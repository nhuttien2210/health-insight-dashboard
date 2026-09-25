import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import type { Trend } from '@/types/metric'
import { formatSignedPercent } from '@/utils/format'
import { cn } from '@/libs/cn'

type TrendPillProps = {
  trend: Trend
  comparisonLabel: string
  higherIsBetter: boolean
  className?: string
}

export function TrendPill({ trend, comparisonLabel, higherIsBetter, className }: TrendPillProps) {
  if (!trend) {
    return <p className={cn('text-muted-foreground text-xs', className)}>No comparison yet</p>
  }

  const Icon =
    trend.direction === 'up' ? ArrowUpRight : trend.direction === 'down' ? ArrowDownRight : ArrowRight

  const tone =
    trend.direction === 'stable'
      ? 'text-muted-foreground'
      : (trend.direction === 'up') === higherIsBetter
        ? 'text-success'
        : 'text-destructive'

  return (
    <p className={cn('flex flex-wrap items-center gap-1 text-xs', className)}>
      <span className={cn('inline-flex items-center gap-0.5 font-medium', tone)}>
        <Icon className="size-3.5" aria-hidden />
        {formatSignedPercent(trend.changePercent)}
      </span>
      <span className="text-muted-foreground">{comparisonLabel}</span>
    </p>
  )
}
