import { Scale } from 'lucide-react'
import { useDashboardQuery } from '@/apis/dashboard/dashboard.query'
import { LineTrendChart } from '@/components/charts/TrendChart'
import { TrendChartCard } from '@/components/charts/TrendChartCard'
import { TrendPill } from '@/components/TrendPill'
import { type ChartConfig } from '@/components/ui/chart'
import { RANGE_COMPARISON_LABEL } from '@/constants/range'
import { useRangeDays } from '../hooks/useRangeDays'

const chartConfig = {
  weightKg: { label: 'Weight', color: 'var(--chart-weight)' },
} satisfies ChartConfig

export function WeightTrendCard({ className }: { className?: string }) {
  const rangeDays = useRangeDays()
  const { data, isPending, isError, error, refetch } = useDashboardQuery(rangeDays)

  return (
    <TrendChartCard
      className={className}
      title="Weight"
      description="Daily weight against the BMI range for your height."
      data={data?.overview}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={refetch}
      skeletonClassName="h-50 w-full rounded-lg"
      action={(overview) => (
        <TrendPill
          trend={overview.weightTrend}
          comparisonLabel={RANGE_COMPARISON_LABEL[rangeDays]}
          higherIsBetter={overview.bmiCategory === 'underweight'}
        />
      )}
      footer={(overview) => (
        <span className="flex items-center gap-1.5">
          <Scale className="size-3.5" aria-hidden />
          BMI {overview.bmi} - {overview.bmiCategory}.
        </span>
      )}
    >
      {(overview) => (
        <LineTrendChart
          className="h-50 w-full"
          data={overview.weightSeries}
          dataKey="weightKg"
          config={chartConfig}
          ariaLabel={`Weight over the last ${rangeDays} days, currently ${overview.summary.latestWeightKg} kilograms with a BMI of ${overview.bmi}`}
          yAxis={{
            domain: ['dataMin - 1', 'dataMax + 1'],
            tickFormatter: (value) => `${Math.round(value)}`,
          }}
          target={overview.summary.latestWeightKg}
          formatValue={(value) => `${value.toFixed(1)} kg`}
        />
      )}
    </TrendChartCard>
  )
}
