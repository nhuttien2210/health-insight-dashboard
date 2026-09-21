import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from 'recharts'
import { Apple } from 'lucide-react'
import { useNutritionSummaryQuery } from '@/apis/nutrition/nutrition.query'
import { ChartCard } from '@/components/ChartCard'
import { EmptyState } from '@/components/EmptyState'
import { StateBoundary } from '@/components/StateBoundary'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCompact, formatNumber, formatShortDate } from '@/utils/format'
import { useRangeDays } from '../../hooks/useRangeDays'

const chartConfig = {
  calories: { label: 'Calories', color: 'var(--chart-nutrition)' },
} satisfies ChartConfig

export function CalorieTrendCard({ className }: { className?: string }) {
  const rangeDays = useRangeDays()
  const { data, isPending, isError, error, refetch } = useNutritionSummaryQuery(rangeDays)

  return (
    <ChartCard
      className={className}
      title="Calories eaten"
      description="Logged days only. The dashed line is your daily calorie target."
      footer={
        data
          ? `${data.daysWithinCalorieRange} of ${data.loggedDays} logged days landed within 10% of your ${formatNumber(
              data.targets.calories,
            )} kcal target.`
          : null
      }
    >
      <StateBoundary
        isPending={isPending}
        isError={isError}
        error={error}
        onRetry={refetch}
        isEmpty={data?.series.length === 0}
        skeleton={<Skeleton className="h-[240px] w-full rounded-lg" />}
        empty={
          <EmptyState
            icon={Apple}
            title="Nothing logged yet"
            description="Once meals are logged, your intake will be compared against your target here."
          />
        }
      >
        {data ? (
          <ChartContainer
            config={chartConfig}
            className="h-[240px] w-full"
            aria-label={`Calories eaten over the last ${rangeDays} days, averaging ${formatNumber(
              data.summary.avgCalories,
            )} kcal against a target of ${formatNumber(data.targets.calories)} kcal`}
          >
            <LineChart data={data.series} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
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
                domain={['dataMin - 200', 'dataMax + 200']}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) => formatCompact(value)}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => formatShortDate(String(value))}
                    formatter={(value) => `${formatNumber(Number(value))} kcal`}
                  />
                }
              />
              <ReferenceLine
                y={data.targets.calories}
                stroke="var(--muted-foreground)"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <Line
                type="monotone"
                dataKey="calories"
                stroke="var(--color-calories)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        ) : null}
      </StateBoundary>
    </ChartCard>
  )
}
