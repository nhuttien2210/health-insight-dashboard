import { z } from 'zod'
import { healthTargetsSchema, periodSummarySchema, trendSchema } from '@/apis/health/health.schema'

export const metricAccentSchema = z.enum(['activity', 'sleep', 'nutrition', 'weight', 'heart'])

export const metricSnapshotSchema = z.object({
  key: z.string(),
  label: z.string(),
  value: z.number(),
  unit: z.string(),
  /** Null for metrics without a target, such as resting heart rate. */
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

export const dashboardOverviewSchema = z.object({
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
