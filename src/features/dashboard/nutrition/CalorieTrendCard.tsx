import { Apple } from 'lucide-react'
import { useDashboardQuery } from '@/apis/dashboard/dashboard.query'
import { LineTrendChart } from '@/components/charts/TrendChart'
import { TrendChartCard } from '@/components/charts/TrendChartCard'
import { EmptyState } from '@/components/EmptyState'
import { type ChartConfig } from '@/components/ui/chart'
import { formatNumber } from '@/utils/format'
import { useRangeDays } from '../hooks/useRangeDays'

const chartConfig = {
  calories: { label: 'Calories', color: 'var(--chart-nutrition)' },
} satisfies ChartConfig

export function CalorieTrendCard({ className }: { className?: string }) {
  const rangeDays = useRangeDays()
  const { data, isPending, isError, error, refetch } = useDashboardQuery(rangeDays)

  return (
    <TrendChartCard
      className={className}
      title="Calories eaten"
      description="Logged days only. The dashed line is your daily calorie target."
      data={data?.nutrition}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={refetch}
      isEmpty={(summary) => summary.series.length === 0}
      empty={
        <EmptyState
          icon={Apple}
          title="Nothing logged yet"
          description="Once meals are logged, your intake will be compared against your target here."
        />
      }
      footer={(summary) =>
        `${summary.daysWithinCalorieRange} of ${summary.loggedDays} logged days landed within 10% of your ${formatNumber(
          summary.targets.calories,
        )} kcal target.`
      }
    >
      {(summary) => (
        <LineTrendChart
          data={summary.series}
          dataKey="calories"
          config={chartConfig}
          ariaLabel={`Calories eaten over the last ${rangeDays} days, averaging ${formatNumber(
            summary.summary.avgCalories,
          )} kcal against a target of ${formatNumber(summary.targets.calories)} kcal`}
          yAxis={{ domain: ['dataMin - 200', 'dataMax + 200'] }}
          target={summary.targets.calories}
          formatValue={(value) => `${formatNumber(value)} kcal`}
        />
      )}
    </TrendChartCard>
  )
}
