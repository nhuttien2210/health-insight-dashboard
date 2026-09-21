import type {
  BmiCategory,
  DailyRecord,
  HealthTargets,
  SleepRecord,
  UserProfile,
  WellnessBand,
} from '@/apis/health/health.type'
import type { ProgressTone, Trend } from '@/types/metric'
import {
  ACTIVE_MINUTES_TARGET,
  ACTIVITY_FACTOR,
  BASE_STEP_TARGET,
} from '@/constants/health'
import { clamp, mean } from '@/utils/math'

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

/** Mifflin-St Jeor. */
export function calculateBmr(profile: UserProfile): number {
  const base = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age
  if (profile.sex === 'male') return base + 5
  if (profile.sex === 'female') return base - 161
  return base - 78
}

export function calculateTdee(profile: UserProfile): number {
  return calculateBmr(profile) * ACTIVITY_FACTOR[profile.activityLevel]
}

export function calculateCalorieTarget(profile: UserProfile): number {
  const tdee = calculateTdee(profile)

  if (profile.goals.includes('lose_weight')) {
    const floor = profile.sex === 'female' ? 1200 : 1500
    return Math.round(Math.max(tdee - 500, floor))
  }
  if (profile.goals.includes('build_muscle')) return Math.round(tdee + 300)
  return Math.round(tdee)
}

export function calculateMacroTargets(profile: UserProfile) {
  const calorieTarget = calculateCalorieTarget(profile)
  const proteinPerKg = profile.goals.includes('build_muscle')
    ? 2.0
    : profile.goals.includes('lose_weight')
      ? 1.8
      : 1.6

  const proteinG = Math.round(profile.weightKg * proteinPerKg)
  const fatG = Math.round((calorieTarget * 0.25) / 9)
  const carbsG = Math.round(Math.max((calorieTarget - proteinG * 4 - fatG * 9) / 4, 0))

  return { proteinG, carbsG, fatG }
}

export function calculateStepTarget(profile: UserProfile): number {
  const base = BASE_STEP_TARGET[profile.activityLevel]
  const boosted =
    profile.goals.includes('increase_activity') || profile.goals.includes('lose_weight')
      ? base + 1000
      : base
  return clamp(boosted, 5000, 15000)
}

export function defaultSleepTargetMinutes(age: number): number {
  if (age < 18) return 540
  if (age <= 64) return 480
  return 450
}

export function calculateWaterTargetMl(weightKg: number): number {
  return Math.round((weightKg * 35) / 100) * 100
}

export function calculateTargets(profile: UserProfile): HealthTargets {
  const macros = calculateMacroTargets(profile)

  return {
    steps: calculateStepTarget(profile),
    calories: calculateCalorieTarget(profile),
    proteinG: macros.proteinG,
    carbsG: macros.carbsG,
    fatG: macros.fatG,
    waterMl: calculateWaterTargetMl(profile.weightKg),
    sleepMinutes: profile.sleepTargetMinutes,
    activeMinutes: ACTIVE_MINUTES_TARGET[profile.activityLevel],
  }
}

/** 0-100. Duration is weighted heaviest because it is the lever the user controls. */
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

/**
 * Consecutive days ending today. Today only counts once it already meets the
 * target, otherwise the streak is measured through yesterday.
 */
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

export function calculateWellnessScore(records: DailyRecord[], profile: UserProfile): number {
  if (records.length === 0) return 0

  const targets = calculateTargets(profile)
  const scored = records.filter(
    (record) => record.nutrition.calories > 0 && record.sleep.totalMinutes > 0,
  )
  const usable = scored.length > 0 ? scored : records

  const avgSteps = mean(usable.map((record) => record.steps))
  const avgSleepScore = mean(
    usable.map((record) => calculateSleepScore(record.sleep, targets.sleepMinutes)),
  )
  const avgCalories = mean(usable.map((record) => record.nutrition.calories))

  const activityAdherence = Math.min(avgSteps / targets.steps, 1)
  const sleepAdherence = avgSleepScore / 100
  const nutritionAdherence =
    1 - Math.min(Math.abs(avgCalories - targets.calories) / targets.calories, 1)

  return Math.round(
    (activityAdherence * 0.4 + sleepAdherence * 0.35 + nutritionAdherence * 0.25) * 100,
  )
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
