import { createSummaryQuery } from '@/libs/createSummaryQuery'
import { getNutritionSummary } from './nutrition.service'

export const { keys: nutritionKeys, useSummaryQuery: useNutritionSummaryQuery } =
  createSummaryQuery('nutrition', getNutritionSummary)
