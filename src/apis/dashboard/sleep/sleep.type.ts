import type { z } from 'zod'
import type { sleepPointSchema, sleepSchema } from './sleep.schema'

export type SleepSummary = z.infer<typeof sleepSchema>
export type SleepPoint = z.infer<typeof sleepPointSchema>
