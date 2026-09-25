import { Target } from 'lucide-react'
import { useDashboardQuery } from '@/apis/dashboard/dashboard.query'
import type { GoalProgress } from '@/apis/dashboard/goals/goals.type'
import { EmptyState } from '@/components/EmptyState'
import { ProgressStat } from '@/components/ProgressStat'
import { StateBoundary } from '@/components/StateBoundary'
import { StatusBadge } from '@/components/StatusBadge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatMinutesAsHours, formatNumber } from '@/utils/format'
import { getProgressTone } from '@/utils/health/metrics'
import { useRangeDays } from '../hooks/useRangeDays'

function formatGoalValue(goal: GoalProgress): string {
  if (goal.unit === 'minutes') {
    return `${formatMinutesAsHours(goal.current)} of ${formatMinutesAsHours(goal.target)}`
  }
  return `${formatNumber(goal.current)} of ${formatNumber(goal.target)} ${goal.unit}`
}

export function GoalProgressCard() {
  const rangeDays = useRangeDays()
  const { data, isPending, isError, error, refetch } = useDashboardQuery(rangeDays)

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="text-primary size-4" aria-hidden />
          Goal progress
        </CardTitle>
        <CardDescription>How the last {rangeDays} days measure against each goal.</CardDescription>
      </CardHeader>
      <CardContent>
        <StateBoundary
          isPending={isPending}
          isError={isError}
          error={error}
          onRetry={refetch}
          isEmpty={data?.goals.goalProgress.length === 0}
          skeleton={<Skeleton className="h-56 w-full rounded-lg" />}
          empty={
            <EmptyState
              icon={Target}
              title="No goals selected"
              description="Add a goal to your profile and your targets will adapt to it."
            />
          }
        >
          <div className="space-y-4">
            {data?.goals.goalProgress.map((goal) => (
              <div key={goal.goal} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{goal.label}</p>
                  <StatusBadge tone={getProgressTone(goal.percentComplete)} />
                </div>
                <ProgressStat
                  label={goal.metricLabel}
                  valueLabel={formatGoalValue(goal)}
                  percent={goal.percentComplete}
                />
              </div>
            ))}
          </div>
        </StateBoundary>
      </CardContent>
    </Card>
  )
}
