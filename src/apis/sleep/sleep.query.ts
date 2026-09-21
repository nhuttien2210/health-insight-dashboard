import { createSummaryQuery } from '@/libs/createSummaryQuery'
import { getSleepSummary } from './sleep.service'

export const { keys: sleepKeys, useSummaryQuery: useSleepSummaryQuery } = createSummaryQuery(
  'sleep',
  getSleepSummary,
)
