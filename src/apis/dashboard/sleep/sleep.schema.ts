import { z } from 'zod'
import { periodSummarySchema, trendSchema } from '../health/health.schema'

export const sleepPointSchema = z.object({
  date: z.string(),
  totalMinutes: z.number(),
  deepMinutes: z.number(),
  remMinutes: z.number(),
  lightMinutes: z.number(),
  score: z.number(),
  bedtimeMinutes: z.number(),
})

export const sleepSchema = z.object({
  rangeDays: z.number(),
  sleepTargetMinutes: z.number(),
  summary: periodSummarySchema,
  durationTrend: trendSchema,
  scoreTrend: trendSchema,
  series: z.array(sleepPointSchema),
  nightsAtTarget: z.number(),
  sleepStreak: z.number(),
  bedtimeConsistencyMinutes: z.number(),
  avgBedtime: z.string(),
})
