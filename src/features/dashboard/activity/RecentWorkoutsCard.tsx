import { Bike, Dumbbell, Flame, Footprints, HeartPulse, PersonStanding, Waves } from 'lucide-react'
import { useDashboardQuery } from '@/apis/dashboard/dashboard.query'
import type { WorkoutType } from '@/constants/health'
import { EmptyState } from '@/components/EmptyState'
import { StateBoundary } from '@/components/StateBoundary'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { WORKOUT_LABEL } from '@/constants/health'
import { accentSurface, ACCENT_COLOR } from '@/constants/chart'
import { formatNumber, formatRelativeDay } from '@/utils/format'
import { todayIso } from '@/utils/health/generateHistory'
import { useRangeDays } from '../hooks/useRangeDays'

const WORKOUT_ICON: Record<WorkoutType, typeof Footprints> = {
  walk: Footprints,
  run: PersonStanding,
  cycle: Bike,
  strength: Dumbbell,
  yoga: PersonStanding,
  swim: Waves,
}

export function RecentWorkoutsCard() {
  const rangeDays = useRangeDays()
  const { data, isPending, isError, error, refetch } = useDashboardQuery(rangeDays)
  const today = todayIso()

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-base">Recent workouts</CardTitle>
        <CardDescription>Your last five logged sessions.</CardDescription>
      </CardHeader>
      <CardContent>
        <StateBoundary
          isPending={isPending}
          isError={isError}
          error={error}
          onRetry={refetch}
          isEmpty={data?.activity.recentWorkouts.length === 0}
          skeleton={
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          }
          empty={
            <EmptyState
              icon={Dumbbell}
              title="No workouts in this period"
              description="Nothing logged in the selected range. A 20 minute walk counts too."
            />
          }
        >
          <ul className="divide-border divide-y">
            {data?.activity.recentWorkouts.map((workout) => {
              const Icon = WORKOUT_ICON[workout.type]
              return (
                <li key={workout.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: accentSurface('activity'),
                      color: ACCENT_COLOR.activity,
                    }}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{WORKOUT_LABEL[workout.type]}</p>
                    <p className="text-muted-foreground text-xs">
                      {formatRelativeDay(workout.date, today)} · {workout.durationMinutes} min
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="flex items-center justify-end gap-1 font-medium tabular-nums">
                      <Flame className="size-3.5" aria-hidden />
                      {formatNumber(workout.caloriesBurned)}
                    </p>
                    <p className="text-muted-foreground flex items-center justify-end gap-1 tabular-nums">
                      <HeartPulse className="size-3.5" aria-hidden />
                      {workout.avgHeartRate} bpm
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </StateBoundary>
      </CardContent>
    </Card>
  )
}
