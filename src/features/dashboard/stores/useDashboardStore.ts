import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { DEFAULT_RANGE_DAYS, type RangeDays } from '@/constants/range'

type DashboardState = {
  rangeDays: RangeDays
  setRangeDays: (days: RangeDays) => void
}

/** Not persisted: the range is a view preference, not user data. */
export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set) => ({
      rangeDays: DEFAULT_RANGE_DAYS,
      setRangeDays: (rangeDays) => set({ rangeDays }, false, 'dashboard/setRangeDays'),
    }),
    { name: 'DashboardStore' },
  ),
)

export const selectRangeDays = (state: DashboardState) => state.rangeDays
export const selectSetRangeDays = (state: DashboardState) => state.setRangeDays
