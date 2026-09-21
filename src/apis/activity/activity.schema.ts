import { z } from 'zod'
import { periodSummarySchema, trendSchema, workoutSchema } from '@/apis/health/health.schema'
import { workoutTypeSchema } from '@/apis/health/health.schema'

export const activityPointSchema = z.object({
  date: z.string(),
  steps: z.number(),
  activeMinutes: z.number(),
})

export const recentWorkoutSchema = workoutSchema.extend({
  date: z.string(),
})

export const workoutBreakdownSchema = z.object({
  type: workoutTypeSchema,
  sessions: z.number(),
  minutes: z.number(),
})

export const activitySummarySchema = z.object({
  rangeDays: z.number(),
  stepTarget: z.number(),
  activeMinutesTarget: z.number(),
  summary: periodSummarySchema,
  stepsTrend: trendSchema,
  activeMinutesTrend: trendSchema,
  restingHeartRateTrend: trendSchema,
  series: z.array(activityPointSchema),
  stepStreak: z.number(),
  daysAtTarget: z.number(),
  bestDay: activityPointSchema.nullable(),
  recentWorkouts: z.array(recentWorkoutSchema),
  breakdown: z.array(workoutBreakdownSchema),
})
