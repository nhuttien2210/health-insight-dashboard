export const RANGE_OPTIONS = [7, 30, 90] as const

export type RangeDays = (typeof RANGE_OPTIONS)[number]

export const RANGE_LABEL: Record<RangeDays, string> = {
  7: '7 days',
  30: '30 days',
  90: '90 days',
}

export const RANGE_SHORT_LABEL: Record<RangeDays, string> = {
  7: '7d',
  30: '30d',
  90: '90d',
}

export const RANGE_COMPARISON_LABEL: Record<RangeDays, string> = {
  7: 'vs previous 7 days',
  30: 'vs previous 30 days',
  90: 'vs previous 90 days',
}

export const DEFAULT_RANGE_DAYS: RangeDays = 30
