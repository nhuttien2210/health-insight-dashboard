import type { DailyRecord, UserProfile } from '@/apis/health/health.type'
import { readPeriod } from '@/apis/health/health.service'
import { simulateLatency } from '@/utils/async'
import { summarizePeriod } from '@/utils/health/aggregate'
import { calculateStreak, calculateTargets, calculateTrend } from '@/utils/health/metrics'
import { activitySummarySchema } from './activity.schema'
import type { ActivityPoint, ActivitySummary, RecentWorkout, WorkoutBreakdown } from './activity.type'

function buildBreakdown(records: DailyRecord[]): WorkoutBreakdown[] {
  const map = new Map<string, WorkoutBreakdown>()

  for (const record of records) {
    for (const workout of record.workouts) {
      const entry = map.get(workout.type) ?? { type: workout.type, sessions: 0, minutes: 0 }
      entry.sessions += 1
      entry.minutes += workout.durationMinutes
      map.set(workout.type, entry)
    }
  }

  return [...map.values()].sort((a, b) => b.minutes - a.minutes)
}

function buildRecentWorkouts(records: DailyRecord[], limit: number): RecentWorkout[] {
  return records
    .flatMap((record) => record.workouts.map((workout) => ({ ...workout, date: record.date })))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit)
}

export async function getActivitySummary(
  profile: UserProfile,
  rangeDays: number,
  signal?: AbortSignal,
): Promise<ActivitySummary> {
  await simulateLatency(signal)

  const { history, current, previous } = readPeriod(profile, rangeDays)
  const targets = calculateTargets(profile)

  const series: ActivityPoint[] = current.map((record) => ({
    date: record.date,
    steps: record.steps,
    activeMinutes: record.activeMinutes,
  }))

  const bestDay = series.reduce<ActivityPoint | null>(
    (best, point) => (best === null || point.steps > best.steps ? point : best),
    null,
  )

  return activitySummarySchema.parse({
    rangeDays,
    stepTarget: targets.steps,
    activeMinutesTarget: targets.activeMinutes,
    summary: summarizePeriod(current, profile),
    stepsTrend: calculateTrend(
      current.map((record) => record.steps),
      previous.map((record) => record.steps),
    ),
    activeMinutesTrend: calculateTrend(
      current.map((record) => record.activeMinutes),
      previous.map((record) => record.activeMinutes),
    ),
    restingHeartRateTrend: calculateTrend(
      current.map((record) => record.restingHeartRate),
      previous.map((record) => record.restingHeartRate),
    ),
    series,
    stepStreak: calculateStreak(history, (record) => record.steps >= targets.steps),
    daysAtTarget: current.filter((record) => record.steps >= targets.steps).length,
    bestDay,
    recentWorkouts: buildRecentWorkouts(current, 5),
    breakdown: buildBreakdown(current),
  })
}
