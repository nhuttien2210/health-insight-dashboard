import type { UserProfile } from '@/apis/health/health.type'
import { readPeriod } from '@/apis/health/health.service'
import { CALORIE_TOLERANCE } from '@/constants/health'
import { simulateLatency } from '@/utils/async'
import { mean } from '@/utils/math'
import { summarizePeriod } from '@/utils/health/aggregate'
import { hasNutrition } from '@/utils/health/generateHistory'
import { calculateTargets, calculateTrend } from '@/utils/health/metrics'
import { nutritionSummarySchema } from './nutrition.schema'
import type { NutritionPoint, NutritionSummary } from './nutrition.type'

export async function getNutritionSummary(
  profile: UserProfile,
  rangeDays: number,
  signal?: AbortSignal,
): Promise<NutritionSummary> {
  await simulateLatency(signal)

  const { current, previous, today } = readPeriod(profile, rangeDays)
  const targets = calculateTargets(profile)

  const logged = current.filter(hasNutrition)
  const previousLogged = previous.filter(hasNutrition)
  const todayRecord = current.find((record) => record.date === today)

  const series: NutritionPoint[] = logged.map((record) => ({
    date: record.date,
    calories: record.nutrition.calories,
    proteinG: record.nutrition.proteinG,
    carbsG: record.nutrition.carbsG,
    fatG: record.nutrition.fatG,
    waterMl: record.nutrition.waterMl,
  }))

  return nutritionSummarySchema.parse({
    rangeDays,
    targets,
    summary: summarizePeriod(current, profile),
    caloriesTrend: calculateTrend(
      logged.map((record) => record.nutrition.calories),
      previousLogged.map((record) => record.nutrition.calories),
    ),
    proteinTrend: calculateTrend(
      logged.map((record) => record.nutrition.proteinG),
      previousLogged.map((record) => record.nutrition.proteinG),
    ),
    series,
    loggedDays: logged.length,
    daysWithinCalorieRange: logged.filter(
      (record) =>
        Math.abs(record.nutrition.calories - targets.calories) <=
        targets.calories * CALORIE_TOLERANCE,
    ).length,
    avgMacroSplit: {
      proteinG: Math.round(mean(logged.map((record) => record.nutrition.proteinG))),
      carbsG: Math.round(mean(logged.map((record) => record.nutrition.carbsG))),
      fatG: Math.round(mean(logged.map((record) => record.nutrition.fatG))),
    },
    today:
      todayRecord && hasNutrition(todayRecord)
        ? {
            date: todayRecord.date,
            calories: todayRecord.nutrition.calories,
            proteinG: todayRecord.nutrition.proteinG,
            carbsG: todayRecord.nutrition.carbsG,
            fatG: todayRecord.nutrition.fatG,
            waterMl: todayRecord.nutrition.waterMl,
          }
        : null,
  })
}
