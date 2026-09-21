import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from 'recharts'
import { Scale } from 'lucide-react'
import { useDashboardOverviewQuery } from '@/apis/dashboard/dashboard.query'
import { ChartCard } from '@/components/ChartCard'
import { StateBoundary } from '@/components/StateBoundary'
import { TrendPill } from '@/components/TrendPill'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import { RANGE_COMPARISON_LABEL } from '@/constants/range'
import { formatShortDate } from '@/utils/format'
import { useRangeDays } from '../../hooks/useRangeDays'

const chartConfig = {
  weightKg: { label: 'Weight', color: 'var(--chart-weight)' },
} satisfies ChartConfig

export function WeightTrendCard({ className }: { className?: string }) {
  const rangeDays = useRangeDays()
  const { data, isPending, isError, error, refetch } = useDashboardOverviewQuery(rangeDays)

  const goingDownIsBetter = data ? data.bmiCategory !== 'underweight' : true

  return (
    <ChartCard
      className={className}
      title="Weight"
      description="Daily weight against the BMI range for your height."
      action={
        data ? (
          <TrendPill
            trend={data.weightTrend}
            comparisonLabel={RANGE_COMPARISON_LABEL[rangeDays]}
            higherIsBetter={!goingDownIsBetter}
          />
        ) : null
      }
    >
      <StateBoundary
        isPending={isPending}
        isError={isError}
        error={error}
        onRetry={refetch}
        skeleton={<Skeleton className="h-[200px] w-full rounded-lg" />}
      >
        {data ? (
          <ChartContainer
            config={chartConfig}
            className="h-[200px] w-full"
            aria-label={`Weight over the last ${rangeDays} days, currently ${data.summary.latestWeightKg} kilograms with a BMI of ${data.bmi}`}
          >
            <LineChart data={data.weightSeries} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
                interval="preserveStartEnd"
                tickFormatter={formatShortDate}
              />
              <YAxis
                width={44}
                domain={['dataMin - 1', 'dataMax + 1']}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) => `${Math.round(value)}`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => formatShortDate(String(value))}
                    formatter={(value) => `${Number(value).toFixed(1)} kg`}
                  />
                }
              />
              <ReferenceLine
                y={data.summary.latestWeightKg}
                stroke="var(--muted-foreground)"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <Line
                type="monotone"
                dataKey="weightKg"
                stroke="var(--color-weightKg)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        ) : null}
      </StateBoundary>

      <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
        <Scale className="size-3.5" aria-hidden />
        {data ? `BMI ${data.bmi} - ${data.bmiCategory}.` : null}
      </p>
    </ChartCard>
  )
}
