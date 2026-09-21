import { createSummaryQuery } from '@/libs/createSummaryQuery'
import { getGoalsSummary } from './goals.service'

export const { keys: goalsKeys, useSummaryQuery: useGoalsSummaryQuery } = createSummaryQuery(
  'goals',
  getGoalsSummary,
)
