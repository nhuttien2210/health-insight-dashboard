import { z } from 'zod'
import { periodSummarySchema, trendSchema } from '@/apis/health/health.schema'

export const sleepPointSchema = z.object({
  date: z.string(),
  totalMinutes: z.number(),
  deepMinutes: z.number(),
  remMinutes: z.number(),
  lightMinutes: z.number(),
  score: z.number(),
  bedtimeMinutes: z.number(),
})

export const sleepSummarySchema = z.object({
  rangeDays: z.number(),
  sleepTargetMinutes: z.number(),
  summary: periodSummarySchema,
  durationTrend: trendSchema,
  scoreTrend: trendSchema,
  series: z.array(sleepPointSchema),
  nightsAtTarget: z.number(),
  sleepStreak: z.number(),
  /** Standard deviation of bedtime in minutes. Lower means a steadier rhythm. */
  bedtimeConsistencyMinutes: z.number(),
  avgBedtime: z.string(),
})
