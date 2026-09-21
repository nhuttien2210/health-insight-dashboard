import { RANGE_LABEL, RANGE_OPTIONS, type RangeDays } from '@/constants/range'
import { cn } from '@/libs/cn'
import { selectSetRangeDays, useDashboardStore } from '../stores/useDashboardStore'
import { useRangeDays } from '../hooks/useRangeDays'

export function RangeFilter() {
  const rangeDays = useRangeDays()
  const setRangeDays = useDashboardStore(selectSetRangeDays)

  return (
    <div
      role="group"
      aria-label="Select time range"
      className="bg-muted inline-flex rounded-lg p-0.5"
    >
      {RANGE_OPTIONS.map((option: RangeDays) => {
        const isActive = option === rangeDays
        return (
          <button
            key={option}
            type="button"
            onClick={() => setRangeDays(option)}
            aria-pressed={isActive}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm transition-colors',
              'focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none',
              isActive
                ? 'bg-background text-foreground font-medium shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {RANGE_LABEL[option]}
          </button>
        )
      })}
    </div>
  )
}
