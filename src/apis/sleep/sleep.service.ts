import type { UserProfile } from '@/apis/health/health.type'
import { readPeriod } from '@/apis/health/health.service'
import { simulateLatency } from '@/utils/async'
import { bedtimeToMinutes, formatClock } from '@/utils/format'
import { mean, standardDeviation } from '@/utils/math'
import { summarizePeriod } from '@/utils/health/aggregate'
import { calculateSleepScore, calculateStreak, calculateTargets, calculateTrend } from '@/utils/health/metrics'
import { sleepSummarySchema } from './sleep.schema'
import type { SleepPoint, SleepSummary } from './sleep.type'

export async function getSleepSummary(
  profile: UserProfile,
  rangeDays: number,
  signal?: AbortSignal,
): Promise<SleepSummary> {
  await simulateLatency(signal)

  const { history, current, previous } = readPeriod(profile, rangeDays)
  const targets = calculateTargets(profile)

  const series: SleepPoint[] = current.map((record) => ({
    date: record.date,
    totalMinutes: record.sleep.totalMinutes,
    deepMinutes: record.sleep.deepMinutes,
    remMinutes: record.sleep.remMinutes,
    lightMinutes: Math.max(
      record.sleep.totalMinutes - record.sleep.deepMinutes - record.sleep.remMinutes,
      0,
    ),
    score: calculateSleepScore(record.sleep, targets.sleepMinutes),
    bedtimeMinutes: bedtimeToMinutes(record.sleep.bedtime),
  }))

  const bedtimes = series.map((point) => point.bedtimeMinutes)

  return sleepSummarySchema.parse({
    rangeDays,
    sleepTargetMinutes: targets.sleepMinutes,
    summary: summarizePeriod(current, profile),
    durationTrend: calculateTrend(
      current.map((record) => record.sleep.totalMinutes),
      previous.map((record) => record.sleep.totalMinutes),
    ),
    scoreTrend: calculateTrend(
      current.map((record) => calculateSleepScore(record.sleep, targets.sleepMinutes)),
      previous.map((record) => calculateSleepScore(record.sleep, targets.sleepMinutes)),
    ),
    series,
    nightsAtTarget: current.filter((record) => record.sleep.totalMinutes >= targets.sleepMinutes)
      .length,
    sleepStreak: calculateStreak(history, (record) => record.sleep.totalMinutes >= targets.sleepMinutes),
    bedtimeConsistencyMinutes: Math.round(standardDeviation(bedtimes)),
    avgBedtime: formatClock(mean(bedtimes)),
  })
}
