import { z } from 'zod'
import { periodSummarySchema, trendSchema, workoutTypeSchema } from '../health/health.schema'

export const activityPointSchema = z.object({
  date: z.string(),
  steps: z.number(),
  activeMinutes: z.number(),
})

export const recentWorkoutSchema = z.object({
  id: z.string(),
  type: workoutTypeSchema,
  durationMinutes: z.number(),
  caloriesBurned: z.number(),
  avgHeartRate: z.number(),
  date: z.string(),
})

export const workoutBreakdownSchema = z.object({
  type: workoutTypeSchema,
  sessions: z.number(),
  minutes: z.number(),
})

export const activitySchema = z.object({
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
