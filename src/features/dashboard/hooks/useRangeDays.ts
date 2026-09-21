import { RANGE_COMPARISON_LABEL, type RangeDays } from '@/constants/range'
import { selectRangeDays, useDashboardStore } from '../stores/useDashboardStore'

/**
 * Each section subscribes to the range itself rather than receiving it from the
 * page, so switching range re-renders only the sections and not the whole shell.
 */
export function useRangeDays(): RangeDays {
  return useDashboardStore(selectRangeDays)
}

export function useComparisonLabel(): string {
  return RANGE_COMPARISON_LABEL[useRangeDays()]
}
