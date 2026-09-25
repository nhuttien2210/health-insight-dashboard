import { Footprints } from 'lucide-react'
import { useDashboardQuery } from '@/apis/dashboard/dashboard.query'
import { BarTrendChart } from '@/components/charts/TrendChart'
import { TrendChartCard } from '@/components/charts/TrendChartCard'
import { EmptyState } from '@/components/EmptyState'
import { type ChartConfig } from '@/components/ui/chart'
import { formatNumber, formatShortDate } from '@/utils/format'
import { useRangeDays } from '../hooks/useRangeDays'

const chartConfig = {
  steps: { label: 'Steps', color: 'var(--chart-activity)' },
} satisfies ChartConfig

export function ActivityTrendCard({ className }: { className?: string }) {
  const rangeDays = useRangeDays()
  const { data, isPending, isError, error, refetch } = useDashboardQuery(rangeDays)

  return (
    <TrendChartCard
      className={className}
      title="Daily steps"
      description="Each bar is one day. The dashed line is your daily target."
      data={data?.activity}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={refetch}
      isEmpty={(summary) => summary.series.length === 0}
      empty={
        <EmptyState
          icon={Footprints}
          title="No activity in this period"
          description="Pick a longer range to see how your step count is moving."
        />
      }
      footer={(summary) =>
        `${summary.daysAtTarget} of ${summary.series.length} days hit the ${formatNumber(
          summary.stepTarget,
        )} step target.${
          summary.bestDay
            ? ` Best day: ${formatNumber(summary.bestDay.steps)} on ${formatShortDate(summary.bestDay.date)}.`
            : ''
        }`
      }
    >
      {(summary) => (
        <BarTrendChart
          data={summary.series}
          dataKey="steps"
          config={chartConfig}
          ariaLabel={`Daily steps over the last ${rangeDays} days, averaging ${formatNumber(
            summary.summary.avgSteps,
          )} steps against a target of ${formatNumber(summary.stepTarget)}`}
          target={summary.stepTarget}
          formatValue={(value) => `${formatNumber(value)} steps`}
        />
      )}
    </TrendChartCard>
  )
}
