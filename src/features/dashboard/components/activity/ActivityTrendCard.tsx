import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from 'recharts'
import { Footprints } from 'lucide-react'
import { useActivitySummaryQuery } from '@/apis/activity/activity.query'
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
  steps: { label: 'Steps', color: 'var(--chart-activity)' },
} satisfies ChartConfig

export function ActivityTrendCard({ className }: { className?: string }) {
  const rangeDays = useRangeDays()
  const { data, isPending, isError, error, refetch } = useActivitySummaryQuery(rangeDays)

  return (
    <ChartCard
      className={className}
      title="Daily steps"
      description="Each bar is one day. The dashed line is your daily target."
      footer={
        data
          ? `${data.daysAtTarget} of ${data.series.length} days hit the ${formatNumber(
              data.stepTarget,
            )} step target.${
              data.bestDay
                ? ` Best day: ${formatNumber(data.bestDay.steps)} on ${formatShortDate(data.bestDay.date)}.`
                : ''
            }`
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
            icon={Footprints}
            title="No activity in this period"
            description="Pick a longer range to see how your step count is moving."
          />
        }
      >
        {data ? (
          <ChartContainer
            config={chartConfig}
            className="h-[240px] w-full"
            aria-label={`Daily steps over the last ${rangeDays} days, averaging ${formatNumber(
              data.summary.avgSteps,
            )} steps against a target of ${formatNumber(data.stepTarget)}`}
          >
            <BarChart data={data.series} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
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
                width={40}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) => formatCompact(value)}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => formatShortDate(String(value))}
                    formatter={(value) => `${formatNumber(Number(value))} steps`}
                  />
                }
              />
              <ReferenceLine
                y={data.stepTarget}
                stroke="var(--muted-foreground)"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <Bar dataKey="steps" fill="var(--color-steps)" radius={[3, 3, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ChartContainer>
        ) : null}
      </StateBoundary>
    </ChartCard>
  )
}
