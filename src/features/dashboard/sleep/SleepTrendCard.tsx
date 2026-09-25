import { Moon } from 'lucide-react'
import { useDashboardQuery } from '@/apis/dashboard/dashboard.query'
import { StackedAreaTrendChart } from '@/components/charts/TrendChart'
import { TrendChartCard } from '@/components/charts/TrendChartCard'
import { EmptyState } from '@/components/EmptyState'
import { type ChartConfig } from '@/components/ui/chart'
import { formatMinutesAsHours } from '@/utils/format'
import { useRangeDays } from '../hooks/useRangeDays'

const chartConfig = {
  deepMinutes: { label: 'Deep', color: 'var(--chart-sleep)' },
  remMinutes: { label: 'REM', color: 'var(--chart-sleep-rem)' },
  lightMinutes: { label: 'Light', color: 'var(--chart-sleep-light)' },
} satisfies ChartConfig

export function SleepTrendCard({ className }: { className?: string }) {
  const rangeDays = useRangeDays()
  const { data, isPending, isError, error, refetch } = useDashboardQuery(rangeDays)

  return (
    <TrendChartCard
      className={className}
      title="Sleep duration and stages"
      description="Stacked hours per night. The dashed line is your nightly target."
      data={data?.sleep}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={refetch}
      isEmpty={(summary) => summary.series.length === 0}
      empty={
        <EmptyState
          icon={Moon}
          title="No sleep data in this period"
          description="Pick a longer range to see how your nights are trending."
        />
      }
      footer={(summary) =>
        `${summary.nightsAtTarget} of ${summary.series.length} nights met your ${formatMinutesAsHours(
          summary.sleepTargetMinutes,
        )} target. Average bedtime ${summary.avgBedtime}, varying by about ${
          summary.bedtimeConsistencyMinutes
        } minutes.`
      }
    >
      {(summary) => (
        <StackedAreaTrendChart
          data={summary.series}
          stackId="sleep"
          series={[
            { dataKey: 'deepMinutes', fillOpacity: 0.5 },
            { dataKey: 'remMinutes', fillOpacity: 0.4 },
            { dataKey: 'lightMinutes', fillOpacity: 0.3 },
          ]}
          config={chartConfig}
          ariaLabel={`Sleep stages over the last ${rangeDays} days, averaging ${formatMinutesAsHours(
            summary.summary.avgSleepMinutes,
          )} per night`}
          yAxis={{ tickFormatter: (value) => `${Math.round(value / 60)}h` }}
          target={summary.sleepTargetMinutes}
          formatValue={(value, name) =>
            `${chartConfig[name as keyof typeof chartConfig]?.label ?? name}: ${formatMinutesAsHours(value)}`
          }
        />
      )}
    </TrendChartCard>
  )
}
