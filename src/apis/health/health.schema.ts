import { z } from 'zod'
import {
  ACTIVITY_LEVEL_VALUES,
  GOAL_VALUES,
  PROFILE_LIMITS,
  SEX_VALUES,
  WORKOUT_TYPE_VALUES,
} from '@/constants/health'

export const sexSchema = z.enum(SEX_VALUES)
export const activityLevelSchema = z.enum(ACTIVITY_LEVEL_VALUES)
export const goalTypeSchema = z.enum(GOAL_VALUES)
export const workoutTypeSchema = z.enum(WORKOUT_TYPE_VALUES)

export const trendSchema = z
  .object({
    changePercent: z.number(),
    direction: z.enum(['up', 'down', 'stable']),
  })
  .nullable()

export const userProfileSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().min(1),
  name: z.string().min(1).max(50),
  age: z.number().int().min(PROFILE_LIMITS.age.min).max(PROFILE_LIMITS.age.max),
  sex: sexSchema,
  heightCm: z.number().min(PROFILE_LIMITS.heightCm.min).max(PROFILE_LIMITS.heightCm.max),
  weightKg: z.number().min(PROFILE_LIMITS.weightKg.min).max(PROFILE_LIMITS.weightKg.max),
  activityLevel: activityLevelSchema,
  goals: z.array(goalTypeSchema).min(PROFILE_LIMITS.goals.min).max(PROFILE_LIMITS.goals.max),
  sleepTargetMinutes: z
    .number()
    .min(PROFILE_LIMITS.sleepTargetMinutes.min)
    .max(PROFILE_LIMITS.sleepTargetMinutes.max),
})

export const sleepRecordSchema = z.object({
  totalMinutes: z.number(),
  deepMinutes: z.number(),
  remMinutes: z.number(),
  awakeMinutes: z.number(),
  efficiency: z.number(),
  bedtime: z.string(),
})

export const nutritionRecordSchema = z.object({
  calories: z.number(),
  proteinG: z.number(),
  carbsG: z.number(),
  fatG: z.number(),
  waterMl: z.number(),
})

export const workoutSchema = z.object({
  id: z.string(),
  type: workoutTypeSchema,
  durationMinutes: z.number(),
  caloriesBurned: z.number(),
  avgHeartRate: z.number(),
})

export const dailyRecordSchema = z.object({
  date: z.string(),
  steps: z.number(),
  activeMinutes: z.number(),
  distanceM: z.number(),
  caloriesBurned: z.number(),
  restingHeartRate: z.number(),
  weightKg: z.number(),
  mood: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  sleep: sleepRecordSchema,
  nutrition: nutritionRecordSchema,
  workouts: z.array(workoutSchema),
})

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
