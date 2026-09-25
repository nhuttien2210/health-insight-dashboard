import type { z } from 'zod'
import type { nutritionPointSchema, nutritionSchema } from './nutrition.schema'

export type NutritionSummary = z.infer<typeof nutritionSchema>
export type NutritionPoint = z.infer<typeof nutritionPointSchema>
