import type { z } from 'zod'
import type { WorkoutType } from '@/constants/health'
import type { healthTargetsSchema, periodSummarySchema } from './health.schema'

export type HealthTargets = z.infer<typeof healthTargetsSchema>
export type PeriodSummary = z.infer<typeof periodSummarySchema>

export type SleepRecord = {
  totalMinutes: number
  deepMinutes: number
  remMinutes: number
  awakeMinutes: number
  efficiency: number
  bedtime: string
}

export type NutritionRecord = {
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
  waterMl: number
}

export type Workout = {
  id: string
  type: WorkoutType
  durationMinutes: number
  caloriesBurned: number
  avgHeartRate: number
}

export type DailyRecord = {
  date: string
  steps: number
  activeMinutes: number
  distanceM: number
  caloriesBurned: number
  restingHeartRate: number
  weightKg: number
  mood: 1 | 2 | 3 | 4 | 5
  sleep: SleepRecord
  nutrition: NutritionRecord
  workouts: Workout[]
}
