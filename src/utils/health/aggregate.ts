import type { DailyRecord, PeriodSummary, UserProfile } from '@/apis/health/health.type'
import { mean } from '@/utils/math'
import { hasNutrition } from './generateHistory'
import { calculateSleepScore, calculateTargets } from './metrics'

export function summarizePeriod(records: DailyRecord[], profile: UserProfile): PeriodSummary {
  const targets = calculateTargets(profile)
  const nutritionDays = records.filter(hasNutrition)

  return {
    days: records.length,
    avgSteps: Math.round(mean(records.map((record) => record.steps))),
    avgActiveMinutes: Math.round(mean(records.map((record) => record.activeMinutes))),
    avgCaloriesBurned: Math.round(mean(records.map((record) => record.caloriesBurned))),
    avgSleepMinutes: Math.round(mean(records.map((record) => record.sleep.totalMinutes))),
    avgSleepScore: Math.round(
      mean(records.map((record) => calculateSleepScore(record.sleep, targets.sleepMinutes))),
    ),
    avgCalories: Math.round(mean(nutritionDays.map((record) => record.nutrition.calories))),
    avgProteinG: Math.round(mean(nutritionDays.map((record) => record.nutrition.proteinG))),
    avgWaterMl: Math.round(mean(nutritionDays.map((record) => record.nutrition.waterMl))),
    avgRestingHeartRate: Math.round(mean(records.map((record) => record.restingHeartRate))),
    latestWeightKg: records.at(-1)?.weightKg ?? profile.weightKg,
    totalWorkouts: records.reduce((total, record) => total + record.workouts.length, 0),
  }
}

/**
 * Splits the history into the selected window and the window immediately before
 * it, so every comparison uses periods of equal length.
 */
export function splitPeriods(records: DailyRecord[], rangeDays: number) {
  return {
    current: records.slice(-rangeDays),
    previous: records.slice(-rangeDays * 2, -rangeDays),
  }
}
