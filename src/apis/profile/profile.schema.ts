import { z } from 'zod'
import { activityLevelSchema, goalTypeSchema, sexSchema } from '@/apis/health/health.schema'
import { PROFILE_LIMITS } from '@/constants/health'

type NumericFieldConfig = {
  min: number
  max: number
  minMessage: string
  maxMessage: string
  integer?: boolean
}

/**
 * Inputs stay strings so the form stays controlled and an empty field produces a
 * readable message instead of "received NaN"; the parsed output is a number.
 */
function numericField(config: NumericFieldConfig) {
  const base = config.integer ? z.number().int('Use a whole number') : z.number()

  return z
    .string()
    .trim()
    .min(1, 'This field is required')
    .refine((value) => Number.isFinite(Number(value)), 'Enter a number')
    .transform((value) => Number(value))
    .pipe(base.min(config.min, config.minMessage).max(config.max, config.maxMessage))
}

export const profileFormSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name').max(50, 'Keep it under 50 characters'),
  age: numericField({
    min: PROFILE_LIMITS.age.min,
    max: PROFILE_LIMITS.age.max,
    minMessage: `You must be ${PROFILE_LIMITS.age.min} or older`,
    maxMessage: `Enter an age up to ${PROFILE_LIMITS.age.max}`,
    integer: true,
  }),
  sex: sexSchema,
  heightCm: numericField({
    min: PROFILE_LIMITS.heightCm.min,
    max: PROFILE_LIMITS.heightCm.max,
    minMessage: `Enter at least ${PROFILE_LIMITS.heightCm.min} cm`,
    maxMessage: `Enter at most ${PROFILE_LIMITS.heightCm.max} cm`,
  }),
  weightKg: numericField({
    min: PROFILE_LIMITS.weightKg.min,
    max: PROFILE_LIMITS.weightKg.max,
    minMessage: `Enter at least ${PROFILE_LIMITS.weightKg.min} kg`,
    maxMessage: `Enter at most ${PROFILE_LIMITS.weightKg.max} kg`,
  }),
  activityLevel: activityLevelSchema,
  goals: z
    .array(goalTypeSchema)
    .min(PROFILE_LIMITS.goals.min, 'Pick at least one goal')
    .max(PROFILE_LIMITS.goals.max, 'Pick up to three goals'),
  sleepTargetMinutes: numericField({
    min: PROFILE_LIMITS.sleepTargetMinutes.min,
    max: PROFILE_LIMITS.sleepTargetMinutes.max,
    minMessage: 'At least 6 hours',
    maxMessage: 'At most 10 hours',
    integer: true,
  }),
})
