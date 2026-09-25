import { z } from 'zod'
import { activitySchema } from './activity/activity.schema'
import { goalsSchema } from './goals/goals.schema'
import { healthTargetsSchema, periodSummarySchema, trendSchema } from './health/health.schema'
import { nutritionSchema } from './nutrition/nutrition.schema'
import { sleepSchema } from './sleep/sleep.schema'

export const metricAccentSchema = z.enum(['activity', 'sleep', 'nutrition', 'weight', 'heart'])

export const metricSnapshotSchema = z.object({
  key: z.string(),
  label: z.string(),
  value: z.number(),
  unit: z.string(),
  target: z.number().nullable(),
  percent: z.number().nullable(),
  trend: trendSchema,
  sparkline: z.array(z.number()),
  accent: metricAccentSchema,
  higherIsBetter: z.boolean(),
  format: z.enum(['number', 'duration', 'decimal']),
})

export const weightPointSchema = z.object({
  date: z.string(),
  weightKg: z.number(),
})

export const overviewSchema = z.object({
  rangeDays: z.number(),
  today: z.string(),
  wellnessScore: z.number(),
  wellnessBand: z.enum(['excellent', 'good', 'fair', 'needs attention']),
  bmi: z.number(),
  bmiCategory: z.enum(['underweight', 'normal', 'overweight', 'obese']),
  targets: healthTargetsSchema,
  summary: periodSummarySchema,
  metrics: z.array(metricSnapshotSchema),
  weightSeries: z.array(weightPointSchema),
  weightTrend: trendSchema,
  stepStreak: z.number(),
  loggedNutritionToday: z.boolean(),
})

export const userInformationSchema = z.object({
  overview: overviewSchema,
  activity: activitySchema,
  sleep: sleepSchema,
  nutrition: nutritionSchema,
  goals: goalsSchema,
})
