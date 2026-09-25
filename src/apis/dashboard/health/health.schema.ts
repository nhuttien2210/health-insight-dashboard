import { z } from 'zod'
import { GOAL_VALUES, WORKOUT_TYPE_VALUES } from '@/constants/health'

export const goalTypeSchema = z.enum(GOAL_VALUES)
export const workoutTypeSchema = z.enum(WORKOUT_TYPE_VALUES)

export const trendSchema = z
  .object({
    changePercent: z.number(),
    direction: z.enum(['up', 'down', 'stable']),
  })
  .nullable()

export const healthTargetsSchema = z.object({
  steps: z.number(),
  calories: z.number(),
  proteinG: z.number(),
  carbsG: z.number(),
  fatG: z.number(),
  waterMl: z.number(),
  sleepMinutes: z.number(),
  activeMinutes: z.number(),
})

export const periodSummarySchema = z.object({
  days: z.number(),
  avgSteps: z.number(),
  avgActiveMinutes: z.number(),
  avgCaloriesBurned: z.number(),
  avgSleepMinutes: z.number(),
  avgSleepScore: z.number(),
  avgCalories: z.number(),
  avgProteinG: z.number(),
  avgWaterMl: z.number(),
  avgRestingHeartRate: z.number(),
  latestWeightKg: z.number(),
  totalWorkouts: z.number(),
})
