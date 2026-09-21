import type { z } from 'zod'
import type {
  activityPointSchema,
  activitySummarySchema,
  recentWorkoutSchema,
  workoutBreakdownSchema,
} from './activity.schema'

export type ActivityPoint = z.infer<typeof activityPointSchema>
export type RecentWorkout = z.infer<typeof recentWorkoutSchema>
export type WorkoutBreakdown = z.infer<typeof workoutBreakdownSchema>
export type ActivitySummary = z.infer<typeof activitySummarySchema>
