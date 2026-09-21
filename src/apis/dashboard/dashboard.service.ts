import type { UserProfile } from '@/apis/health/health.type'
import { readPeriod } from '@/apis/health/health.service'
import { simulateLatency } from '@/utils/async'
import { percentOf } from '@/utils/math'
import { summarizePeriod } from '@/utils/health/aggregate'
import { hasNutrition } from '@/utils/health/generateHistory'
import {
  calculateBmi,
  calculateStreak,
  calculateTargets,
  calculateTrend,
  calculateWellnessScore,
  getBmiCategory,
  getWellnessBand,
} from '@/utils/health/metrics'
import { dashboardOverviewSchema } from './dashboard.schema'
import type { DashboardOverview } from './dashboard.type'

export async function getDashboardOverview(
  profile: UserProfile,
  rangeDays: number,
  signal?: AbortSignal,
): Promise<DashboardOverview> {
  await simulateLatency(signal)

  const { history, current, previous, today } = readPeriod(profile, rangeDays)
  const targets = calculateTargets(profile)
  const summary = summarizePeriod(current, profile)

  const loggedCurrent = current.filter(hasNutrition)
  const loggedPrevious = previous.filter(hasNutrition)
  const bmi = calculateBmi(profile.weightKg, profile.heightCm)

  const metrics = [
    {
      key: 'steps',
      label: 'Daily steps',
      value: summary.avgSteps,
      unit: 'avg steps',
      target: targets.steps,
      percent: percentOf(summary.avgSteps, targets.steps),
      trend: calculateTrend(
        current.map((record) => record.steps),
        previous.map((record) => record.steps),
      ),
      sparkline: current.map((record) => record.steps),
      accent: 'activity' as const,
      higherIsBetter: true,
      format: 'number' as const,
    },
    {
      key: 'sleep',
      label: 'Sleep per night',
      value: summary.avgSleepMinutes,
      unit: 'avg',
      target: targets.sleepMinutes,
      percent: percentOf(summary.avgSleepMinutes, targets.sleepMinutes),
      trend: calculateTrend(
        current.map((record) => record.sleep.totalMinutes),
        previous.map((record) => record.sleep.totalMinutes),
      ),
      sparkline: current.map((record) => record.sleep.totalMinutes),
      accent: 'sleep' as const,
      higherIsBetter: true,
      format: 'duration' as const,
    },
    {
      key: 'calories',
      label: 'Calories eaten',
      value: summary.avgCalories,
      unit: 'avg kcal',
      target: targets.calories,
      percent: percentOf(summary.avgCalories, targets.calories),
      trend: calculateTrend(
        loggedCurrent.map((record) => record.nutrition.calories),
        loggedPrevious.map((record) => record.nutrition.calories),
      ),
      sparkline: loggedCurrent.map((record) => record.nutrition.calories),
      accent: 'nutrition' as const,
      higherIsBetter: true,
      format: 'number' as const,
    },
    {
      key: 'restingHeartRate',
      label: 'Resting heart rate',
      value: summary.avgRestingHeartRate,
      unit: 'avg bpm',
      target: null,
      percent: null,
      trend: calculateTrend(
        current.map((record) => record.restingHeartRate),
        previous.map((record) => record.restingHeartRate),
      ),
      sparkline: current.map((record) => record.restingHeartRate),
      accent: 'heart' as const,
      // A falling resting heart rate is the good direction.
      higherIsBetter: false,
      format: 'number' as const,
    },
  ]

  return dashboardOverviewSchema.parse({
    rangeDays,
    today,
    wellnessScore: calculateWellnessScore(current, profile),
    wellnessBand: getWellnessBand(calculateWellnessScore(current, profile)),
    bmi: Math.round(bmi * 10) / 10,
    bmiCategory: getBmiCategory(bmi),
    targets,
    summary,
    metrics,
    weightSeries: current.map((record) => ({ date: record.date, weightKg: record.weightKg })),
    weightTrend: calculateTrend(
      current.map((record) => record.weightKg),
      previous.map((record) => record.weightKg),
    ),
    stepStreak: calculateStreak(history, (record) => record.steps >= targets.steps),
    loggedNutritionToday: current.some((record) => record.date === today && hasNutrition(record)),
  })
}
