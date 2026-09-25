import type { BmiCategory, WellnessBand } from '@/apis/dashboard/dashboard.type'
import type { DailyRecord, SleepRecord } from '@/apis/dashboard/health/health.type'
import type { ProgressTone, Trend } from '@/types/metric'
import { mean } from '@/utils/math'

export function calculateBmi(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100
  return weightKg / (heightM * heightM)
}

export function getBmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return 'underweight'
  if (bmi < 25) return 'normal'
  if (bmi < 30) return 'overweight'
  return 'obese'
}

export function defaultSleepTargetMinutes(age: number): number {
  if (age < 18) return 540
  if (age <= 64) return 480
  return 450
}

export function calculateWaterTargetMl(weightKg: number): number {
  return Math.round((weightKg * 35) / 100) * 100
}

export function calculateSleepScore(sleep: SleepRecord, targetMinutes: number): number {
  if (sleep.totalMinutes <= 0) return 0

  const durationScore = Math.min(sleep.totalMinutes / targetMinutes, 1) * 50
  const efficiencyScore = (sleep.efficiency / 100) * 25
  const qualityRatio = (sleep.deepMinutes + sleep.remMinutes) / sleep.totalMinutes
  const qualityScore = Math.min(qualityRatio / 0.45, 1) * 25

  return Math.round(durationScore + efficiencyScore + qualityScore)
}

export function calculateTrend(current: number[], previous: number[]): Trend {
  if (current.length === 0 || previous.length === 0) return null

  const previousAvg = mean(previous)
  if (previousAvg === 0) return null

  const changePercent = ((mean(current) - previousAvg) / previousAvg) * 100
  const direction = Math.abs(changePercent) < 2 ? 'stable' : changePercent > 0 ? 'up' : 'down'

  return { changePercent, direction }
}

export function calculateStreak(
  records: DailyRecord[],
  predicate: (record: DailyRecord) => boolean,
): number {
  let streak = 0

  for (let i = records.length - 1; i >= 0; i -= 1) {
    if (predicate(records[i])) {
      streak += 1
      continue
    }
    if (i === records.length - 1) continue
    break
  }

  return streak
}

export function getWellnessBand(score: number): WellnessBand {
  if (score >= 80) return 'excellent'
  if (score >= 65) return 'good'
  if (score >= 50) return 'fair'
  return 'needs attention'
}

export function getProgressTone(percent: number): ProgressTone {
  if (percent >= 95) return 'on-track'
  if (percent >= 75) return 'close'
  return 'behind'
}
