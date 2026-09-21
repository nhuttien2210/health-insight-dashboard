import type { z } from 'zod'
import type { goalProgressSchema, goalsSummarySchema, recommendationSchema } from './goals.schema'

export type GoalProgress = z.infer<typeof goalProgressSchema>
export type Recommendation = z.infer<typeof recommendationSchema>
export type GoalsSummary = z.infer<typeof goalsSummarySchema>
