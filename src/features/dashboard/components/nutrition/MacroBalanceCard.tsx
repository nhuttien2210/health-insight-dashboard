import { Droplets, Salad } from 'lucide-react'
import { useNutritionSummaryQuery } from '@/apis/nutrition/nutrition.query'
import { EmptyState } from '@/components/EmptyState'
import { ProgressStat } from '@/components/ProgressStat'
import { StateBoundary } from '@/components/StateBoundary'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatNumber } from '@/utils/format'
import { percentOf } from '@/utils/math'
import { useRangeDays } from '../../hooks/useRangeDays'

export function MacroBalanceCard() {
  const rangeDays = useRangeDays()
  const { data, isPending, isError, error, refetch } = useNutritionSummaryQuery(rangeDays)

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Salad className="size-4" style={{ color: 'var(--chart-nutrition)' }} aria-hidden />
          Macro balance
        </CardTitle>
        <CardDescription>Daily averages across your logged days.</CardDescription>
      </CardHeader>
      <CardContent>
        <StateBoundary
          isPending={isPending}
          isError={isError}
          error={error}
          onRetry={refetch}
          isEmpty={data?.loggedDays === 0}
          skeleton={<Skeleton className="h-44 w-full rounded-lg" />}
          empty={
            <EmptyState
              icon={Salad}
              title="No meals logged"
              description="Log a few days to see how your protein, carbs and fat compare with your targets."
            />
          }
        >
          {data ? (
            <div className="space-y-4">
              <ProgressStat
                label="Protein"
                valueLabel={`${formatNumber(data.avgMacroSplit.proteinG)} of ${formatNumber(
                  data.targets.proteinG,
                )} g`}
                percent={percentOf(data.avgMacroSplit.proteinG, data.targets.proteinG)}
                accent="nutrition"
              />
              <ProgressStat
                label="Carbs"
                valueLabel={`${formatNumber(data.avgMacroSplit.carbsG)} of ${formatNumber(
                  data.targets.carbsG,
                )} g`}
                percent={percentOf(data.avgMacroSplit.carbsG, data.targets.carbsG)}
                accent="activity"
              />
              <ProgressStat
                label="Fat"
                valueLabel={`${formatNumber(data.avgMacroSplit.fatG)} of ${formatNumber(
                  data.targets.fatG,
                )} g`}
                percent={percentOf(data.avgMacroSplit.fatG, data.targets.fatG)}
                accent="weight"
              />
              <ProgressStat
                label="Water"
                valueLabel={`${formatNumber(data.summary.avgWaterMl)} of ${formatNumber(
                  data.targets.waterMl,
                )} ml`}
                percent={percentOf(data.summary.avgWaterMl, data.targets.waterMl)}
                accent="sleep"
                hint={
                  data.today
                    ? undefined
                    : "Today hasn't been logged yet, so it isn't included in these averages."
                }
              />
              <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <Droplets className="size-3.5" aria-hidden />
                Based on {data.loggedDays} logged {data.loggedDays === 1 ? 'day' : 'days'} in the last{' '}
                {rangeDays} days.
              </p>
            </div>
          ) : null}
        </StateBoundary>
      </CardContent>
    </Card>
  )
}
