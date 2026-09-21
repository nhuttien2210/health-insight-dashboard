import type { z } from 'zod'
import type { sleepPointSchema, sleepSummarySchema } from './sleep.schema'

export type SleepPoint = z.infer<typeof sleepPointSchema>
export type SleepSummary = z.infer<typeof sleepSummarySchema>
