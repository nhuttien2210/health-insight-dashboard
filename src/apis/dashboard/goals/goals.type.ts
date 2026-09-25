import type { z } from 'zod'
import type { goalProgressSchema, goalsSchema, recommendationSchema } from './goals.schema'

export type GoalsSummary = z.infer<typeof goalsSchema>
export type GoalProgress = z.infer<typeof goalProgressSchema>
export type Recommendation = z.infer<typeof recommendationSchema>
