import type { z } from 'zod'
import type {
  activityLevelSchema,
  dailyRecordSchema,
  goalTypeSchema,
  healthTargetsSchema,
  nutritionRecordSchema,
  periodSummarySchema,
  sexSchema,
  sleepRecordSchema,
  userProfileSchema,
  workoutSchema,
  workoutTypeSchema,
} from './health.schema'

export type Sex = z.infer<typeof sexSchema>
export type ActivityLevel = z.infer<typeof activityLevelSchema>
export type GoalType = z.infer<typeof goalTypeSchema>
export type WorkoutType = z.infer<typeof workoutTypeSchema>

export type UserProfile = z.infer<typeof userProfileSchema>
export type SleepRecord = z.infer<typeof sleepRecordSchema>
export type NutritionRecord = z.infer<typeof nutritionRecordSchema>
export type Workout = z.infer<typeof workoutSchema>
export type DailyRecord = z.infer<typeof dailyRecordSchema>
export type HealthTargets = z.infer<typeof healthTargetsSchema>
export type PeriodSummary = z.infer<typeof periodSummarySchema>

export type BmiCategory = 'underweight' | 'normal' | 'overweight' | 'obese'
export type WellnessBand = 'excellent' | 'good' | 'fair' | 'needs attention'
