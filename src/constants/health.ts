import type { ActivityLevel, GoalType, WorkoutType } from '@/apis/health/health.type'

// These literal arrays are the source of truth; the zod enums are built from them.
export const SEX_VALUES = ['male', 'female', 'other'] as const

export const ACTIVITY_LEVEL_VALUES = ['sedentary', 'light', 'moderate', 'active', 'athlete'] as const

export const GOAL_VALUES = [
  'lose_weight',
  'build_muscle',
  'improve_sleep',
  'increase_activity',
  'eat_better',
] as const

export const WORKOUT_TYPE_VALUES = ['walk', 'run', 'cycle', 'strength', 'yoga', 'swim'] as const

export const ACTIVITY_LEVEL_LABEL: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary - desk job, little exercise',
  light: 'Light - exercise 1-3 days a week',
  moderate: 'Moderate - exercise 3-5 days a week',
  active: 'Active - exercise 6-7 days a week',
  athlete: 'Athlete - training twice a day',
}

export const GOAL_LABEL: Record<GoalType, string> = {
  lose_weight: 'Lose weight',
  build_muscle: 'Build muscle',
  improve_sleep: 'Improve sleep',
  increase_activity: 'Move more',
  eat_better: 'Eat better',
}

export const WORKOUT_LABEL: Record<WorkoutType, string> = {
  walk: 'Walk',
  run: 'Run',
  cycle: 'Cycling',
  strength: 'Strength',
  yoga: 'Yoga',
  swim: 'Swim',
}

/** Mifflin-St Jeor multipliers used for TDEE. */
export const ACTIVITY_FACTOR: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
}

export const BASE_STEP_TARGET: Record<ActivityLevel, number> = {
  sedentary: 6000,
  light: 8000,
  moderate: 10000,
  active: 12000,
  athlete: 14000,
}

export const ACTIVE_MINUTES_TARGET: Record<ActivityLevel, number> = {
  sedentary: 20,
  light: 30,
  moderate: 45,
  active: 60,
  athlete: 90,
}

export const RESTING_HR_BASELINE: Record<ActivityLevel, number> = {
  sedentary: 72,
  light: 68,
  moderate: 64,
  active: 60,
  athlete: 54,
}

export const WEEKLY_WORKOUT_SESSIONS: Record<ActivityLevel, number> = {
  sedentary: 1,
  light: 2,
  moderate: 3.5,
  active: 5,
  athlete: 6.5,
}

export const GOAL_WORKOUT_TYPES: Record<GoalType, WorkoutType[]> = {
  lose_weight: ['run', 'cycle', 'walk'],
  build_muscle: ['strength', 'swim'],
  improve_sleep: ['yoga', 'walk', 'swim'],
  increase_activity: ['walk', 'run', 'cycle'],
  eat_better: ['walk', 'yoga', 'cycle'],
}

export const WORKOUT_INTENSITY: Record<WorkoutType, { kcalPerMinute: number; heartRate: number }> = {
  walk: { kcalPerMinute: 4.5, heartRate: 105 },
  run: { kcalPerMinute: 11, heartRate: 152 },
  cycle: { kcalPerMinute: 8.5, heartRate: 138 },
  strength: { kcalPerMinute: 6.5, heartRate: 126 },
  yoga: { kcalPerMinute: 3.5, heartRate: 98 },
  swim: { kcalPerMinute: 9.5, heartRate: 132 },
}

export const HISTORY_DAYS = 90

/** A logged day counts as on target when it lands within 10% of the calorie goal. */
export const CALORIE_TOLERANCE = 0.1

export const PROFILE_LIMITS = {
  age: { min: 13, max: 100 },
  heightCm: { min: 120, max: 250 },
  weightKg: { min: 30, max: 250 },
  sleepTargetMinutes: { min: 360, max: 600 },
  goals: { min: 1, max: 3 },
} as const
