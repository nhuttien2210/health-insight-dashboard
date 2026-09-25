import { format, getDay, subDays } from 'date-fns'
import type { WorkoutType } from '@/constants/health'
import { calculateTrend } from '@/utils/health/metrics'
import { mean } from '@/utils/math'

export function datesInRange(rangeDays: number): string[] {
  const today = new Date()
  return Array.from({ length: rangeDays }, (_, index) =>
    format(subDays(today, rangeDays - 1 - index), 'yyyy-MM-dd'),
  )
}

export function along(ratio: number, slope: number, progress: number): number {
  return ratio * (1 - slope / 2 + slope * progress)
}

export function jitter(center: number, _spread: number, min: number, max: number): number {
  return Math.round(Math.min(max, Math.max(min, center)))
}

export function isWeekend(isoDate: string): boolean {
  const day = getDay(new Date(`${isoDate}T00:00:00`))
  return day === 0 || day === 6
}

export function trendFrom(values: number[]) {
  const mid = Math.floor(values.length / 2)
  return calculateTrend(values.slice(mid), values.slice(0, Math.max(mid, 1)))
}

export function streakFromEnd(flags: boolean[]): number {
  let streak = 0
  for (let index = flags.length - 1; index >= 0; index -= 1) {
    if (!flags[index]) break
    streak += 1
  }
  return streak
}

export function roundedMean(values: number[]): number {
  return Math.round(mean(values))
}

export function buildRecommendations(input: {
  avgSteps: number
  stepTarget: number
  avgSleepMinutes: number
  sleepTargetMinutes: number
  avgProteinG: number
  proteinTarget: number
  avgWaterMl: number
  waterTarget: number
  workoutDays: number
  rangeDays: number
}) {
  const items = [
    input.avgSteps < input.stepTarget * 0.9
      ? {
          id: 'steps',
          title: 'Close the step gap',
          reason: `Averaging ${input.avgSteps.toLocaleString('en-US')} steps against a ${input.stepTarget.toLocaleString('en-US')} target.`,
          action: 'Add a 15 minute walk after lunch on weekdays.',
          weight: input.stepTarget - input.avgSteps,
        }
      : null,
    input.avgSleepMinutes < input.sleepTargetMinutes * 0.92
      ? {
          id: 'sleep',
          title: 'Protect a steadier bedtime',
          reason: `Nights average ${Math.round(input.avgSleepMinutes / 60)}h, short of the ${Math.round(input.sleepTargetMinutes / 60)}h target.`,
          action: 'Dim screens 30 minutes earlier and keep the same lights-out time.',
          weight: input.sleepTargetMinutes - input.avgSleepMinutes,
        }
      : null,
    input.avgProteinG < input.proteinTarget * 0.85
      ? {
          id: 'protein',
          title: 'Hit protein more often',
          reason: `Logged days average ${input.avgProteinG}g of protein against a ${input.proteinTarget}g target.`,
          action: 'Add a protein source to breakfast or a snack after training.',
          weight: input.proteinTarget - input.avgProteinG,
        }
      : null,
    input.avgWaterMl < input.waterTarget * 0.8
      ? {
          id: 'water',
          title: 'Drink a bit more water',
          reason: `Water intake averages ${input.avgWaterMl}ml against a ${input.waterTarget}ml target.`,
          action: 'Keep a bottle nearby and finish one before lunch.',
          weight: (input.waterTarget - input.avgWaterMl) / 20,
        }
      : null,
    input.workoutDays < Math.max(2, Math.round(input.rangeDays / 7))
      ? {
          id: 'workouts',
          title: 'Add one extra session',
          reason: `Only ${input.workoutDays} workout${input.workoutDays === 1 ? '' : 's'} in the last ${input.rangeDays} days.`,
          action: 'Block one short session on a day that is usually empty.',
          weight: 40,
        }
      : null,
  ].filter((item) => item !== null)

  return items.sort((left, right) => right.weight - left.weight).slice(0, 3)
}

export type WorkoutBreakdownEntry = { type: WorkoutType; sessions: number; minutes: number }
