import { z } from 'zod'
import { goalTypeSchema } from '@/apis/health/health.schema'

export const goalProgressSchema = z.object({
  goal: goalTypeSchema,
  label: z.string(),
  metricLabel: z.string(),
  current: z.number(),
  target: z.number(),
  unit: z.string(),
  percentComplete: z.number(),
})

export const recommendationSchema = z.object({
  id: z.string(),
  title: z.string(),
  reason: z.string(),
  action: z.string(),
  /** Size of the gap being closed, used to order the list. */
  weight: z.number(),
})

export const goalsSummarySchema = z.object({
  rangeDays: z.number(),
  goalProgress: z.array(goalProgressSchema),
  recommendations: z.array(recommendationSchema),
  isAllOnTrack: z.boolean(),
})
