import type { z } from 'zod'
import type { nutritionPointSchema, nutritionSummarySchema } from './nutrition.schema'

export type NutritionPoint = z.infer<typeof nutritionPointSchema>
export type NutritionSummary = z.infer<typeof nutritionSummarySchema>
