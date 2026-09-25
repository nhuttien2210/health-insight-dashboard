import { Flame, Footprints, HeartPulse, Moon, type LucideIcon } from 'lucide-react'
import type { MetricSnapshot } from '@/apis/dashboard/dashboard.type'
import { MetricCard } from '@/components/MetricCard'
import { formatMinutesAsHours, formatNumber } from '@/utils/format'
import { getProgressTone } from '@/utils/health/metrics'

const METRIC_ICON: Record<string, LucideIcon> = {
  steps: Footprints,
  sleep: Moon,
  calories: Flame,
  restingHeartRate: HeartPulse,
}

function formatValue(metric: MetricSnapshot): string {
  if (metric.format === 'duration') return formatMinutesAsHours(metric.value)
  if (metric.format === 'decimal') return formatNumber(metric.value, 1)
  return formatNumber(metric.value)
}

function formatTarget(metric: MetricSnapshot): string | null {
  if (metric.target === null) return null
  if (metric.format === 'duration') return formatMinutesAsHours(metric.target)
  return formatNumber(metric.target)
}

type OverviewMetricCardProps = {
  metric: MetricSnapshot
  comparisonLabel: string
}

export function OverviewMetricCard({ metric, comparisonLabel }: OverviewMetricCardProps) {
  const target = formatTarget(metric)

  return (
    <MetricCard
      label={metric.label}
      icon={METRIC_ICON[metric.key] ?? Footprints}
      accent={metric.accent}
      value={formatValue(metric)}
      unit={metric.unit}
      trend={metric.trend}
      comparisonLabel={comparisonLabel}
      higherIsBetter={metric.higherIsBetter}
      tone={metric.percent === null ? undefined : getProgressTone(metric.percent)}
      progress={
        metric.percent !== null && target
          ? { percent: metric.percent, label: `${metric.percent}% of ${target} target` }
          : undefined
      }
      sparkline={metric.sparkline}
    />
  )
}
