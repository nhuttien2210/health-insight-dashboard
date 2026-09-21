import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from 'recharts'
import { Moon } from 'lucide-react'
import { useSleepSummaryQuery } from '@/apis/sleep/sleep.query'
import { ChartCard } from '@/components/ChartCard'
import { EmptyState } from '@/components/EmptyState'
import { StateBoundary } from '@/components/StateBoundary'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import { formatMinutesAsHours, formatShortDate } from '@/utils/format'
import { useRangeDays } from '../../hooks/useRangeDays'

const chartConfig = {
  deepMinutes: { label: 'Deep', color: 'var(--chart-sleep)' },
  remMinutes: { label: 'REM', color: 'var(--chart-sleep-rem)' },
  lightMinutes: { label: 'Light', color: 'var(--chart-sleep-light)' },
} satisfies ChartConfig

export function SleepTrendCard({ className }: { className?: string }) {
  const rangeDays = useRangeDays()
  const { data, isPending, isError, error, refetch } = useSleepSummaryQuery(rangeDays)

  return (
    <ChartCard
      className={className}
      title="Sleep duration and stages"
      description="Stacked hours per night. The dashed line is your nightly target."
      footer={
        data
          ? `${data.nightsAtTarget} of ${data.series.length} nights met your ${formatMinutesAsHours(
              data.sleepTargetMinutes,
            )} target. Average bedtime ${data.avgBedtime}, varying by about ${
              data.bedtimeConsistencyMinutes
            } minutes.`
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
            icon={Moon}
            title="No sleep data in this period"
            description="Pick a longer range to see how your nights are trending."
          />
        }
      >
        {data ? (
          <ChartContainer
            config={chartConfig}
            className="h-[240px] w-full"
            aria-label={`Sleep stages over the last ${rangeDays} days, averaging ${formatMinutesAsHours(
              data.summary.avgSleepMinutes,
            )} per night`}
          >
            <AreaChart data={data.series} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
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
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) => `${Math.round(value / 60)}h`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => formatShortDate(String(value))}
                    formatter={(value, name) => `${chartConfig[name as keyof typeof chartConfig]?.label ?? name}: ${formatMinutesAsHours(Number(value))}`}
                  />
                }
              />
              <ReferenceLine
                y={data.sleepTargetMinutes}
                stroke="var(--muted-foreground)"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <Area
                type="monotone"
                dataKey="deepMinutes"
                stackId="sleep"
                stroke="var(--color-deepMinutes)"
                fill="var(--color-deepMinutes)"
                fillOpacity={0.5}
              />
              <Area
                type="monotone"
                dataKey="remMinutes"
                stackId="sleep"
                stroke="var(--color-remMinutes)"
                fill="var(--color-remMinutes)"
                fillOpacity={0.4}
              />
              <Area
                type="monotone"
                dataKey="lightMinutes"
                stackId="sleep"
                stroke="var(--color-lightMinutes)"
                fill="var(--color-lightMinutes)"
                fillOpacity={0.3}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        ) : null}
      </StateBoundary>
    </ChartCard>
  )
}
