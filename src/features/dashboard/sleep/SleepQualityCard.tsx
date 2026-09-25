import { Flame, Moon } from 'lucide-react'
import { useDashboardQuery } from '@/apis/dashboard/dashboard.query'
import { ProgressStat } from '@/components/ProgressStat'
import { StateBoundary } from '@/components/StateBoundary'
import { TrendPill } from '@/components/TrendPill'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { RANGE_COMPARISON_LABEL } from '@/constants/range'
import { formatMinutesAsHours } from '@/utils/format'
import { percentOf } from '@/utils/math'
import { useRangeDays } from '../hooks/useRangeDays'

export function SleepQualityCard() {
  const rangeDays = useRangeDays()
  const { data, isPending, isError, error, refetch } = useDashboardQuery(rangeDays)

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Moon className="size-4" style={{ color: 'var(--chart-sleep)' }} aria-hidden />
          Sleep quality
        </CardTitle>
        <CardDescription>Duration, efficiency and stage balance combined into a score.</CardDescription>
      </CardHeader>
      <CardContent>
        <StateBoundary
          isPending={isPending}
          isError={isError}
          error={error}
          onRetry={refetch}
          skeleton={<Skeleton className="h-48 w-full rounded-lg" />}
        >
          {data ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl leading-none font-semibold tabular-nums">
                    {data.sleep.summary.avgSleepScore}
                  </span>
                  <span className="text-muted-foreground text-sm">/ 100 avg score</span>
                </div>
                <TrendPill
                  className="mt-1"
                  trend={data.sleep.scoreTrend}
                  comparisonLabel={RANGE_COMPARISON_LABEL[rangeDays]}
                  higherIsBetter
                />
              </div>

              <ProgressStat
                label="Average duration"
                valueLabel={`${formatMinutesAsHours(data.sleep.summary.avgSleepMinutes)} of ${formatMinutesAsHours(
                  data.sleep.sleepTargetMinutes,
                )}`}
                percent={percentOf(data.sleep.summary.avgSleepMinutes, data.sleep.sleepTargetMinutes)}
                accent="sleep"
              />

              <ProgressStat
                label="Nights at target"
                valueLabel={`${data.sleep.nightsAtTarget} of ${data.sleep.series.length}`}
                percent={percentOf(data.sleep.nightsAtTarget, Math.max(data.sleep.series.length, 1))}
                accent="sleep"
              />

              <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <Flame className="text-warning size-3.5" aria-hidden />
                {data.sleep.sleepStreak === 0
                  ? 'No current streak of nights at target.'
                  : `${data.sleep.sleepStreak} night${data.sleep.sleepStreak === 1 ? '' : 's'} in a row at target.`}
              </p>
            </div>
          ) : null}
        </StateBoundary>
      </CardContent>
    </Card>
  )
}
