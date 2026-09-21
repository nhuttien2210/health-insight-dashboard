import { createSummaryQuery } from '@/libs/createSummaryQuery'
import { getActivitySummary } from './activity.service'

export const { keys: activityKeys, useSummaryQuery: useActivitySummaryQuery } = createSummaryQuery(
  'activity',
  getActivitySummary,
)
