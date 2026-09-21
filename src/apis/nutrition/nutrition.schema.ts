import { z } from 'zod'
import { healthTargetsSchema, periodSummarySchema, trendSchema } from '@/apis/health/health.schema'

export const nutritionPointSchema = z.object({
  date: z.string(),
  calories: z.number(),
  proteinG: z.number(),
  carbsG: z.number(),
  fatG: z.number(),
  waterMl: z.number(),
})

export const nutritionSummarySchema = z.object({
  rangeDays: z.number(),
  targets: healthTargetsSchema,
  summary: periodSummarySchema,
  caloriesTrend: trendSchema,
  proteinTrend: trendSchema,
  series: z.array(nutritionPointSchema),
  loggedDays: z.number(),
  daysWithinCalorieRange: z.number(),
  avgMacroSplit: z.object({
    proteinG: z.number(),
    carbsG: z.number(),
    fatG: z.number(),
  }),
  /** Null when today has not been logged yet, which drives an empty state. */
  today: nutritionPointSchema.nullable(),
})
