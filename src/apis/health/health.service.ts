import type { DailyRecord, UserProfile } from './health.type'
import { generateHistory, todayIso } from '@/utils/health/generateHistory'
import { splitPeriods } from '@/utils/health/aggregate'
import { AppError } from '@/utils/error'

export type PeriodSlice = {
  history: DailyRecord[]
  current: DailyRecord[]
  previous: DailyRecord[]
  today: string
}

/**
 * Single entry point every feature service uses, so the whole dashboard is built
 * from one consistent history instead of several independent ones.
 */
export function readPeriod(profile: UserProfile, rangeDays: number): PeriodSlice {
  const history = generateHistory(profile)
  const { current, previous } = splitPeriods(history, rangeDays)

  if (current.length === 0) {
    throw new AppError('EMPTY', 'There is no health data for this period yet.')
  }

  return { history, current, previous, today: todayIso() }
}
