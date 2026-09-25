import { RANGE_COMPARISON_LABEL, type RangeDays } from '@/constants/range'
import { selectRangeDays, useDashboardStore } from '../stores/useDashboardStore'

export function useRangeDays(): RangeDays {
  return useDashboardStore(selectRangeDays)
}

export function useComparisonLabel(): string {
  return RANGE_COMPARISON_LABEL[useRangeDays()]
}
