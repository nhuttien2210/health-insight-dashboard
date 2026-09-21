import { format, getDay, subDays } from 'date-fns'
import type { DailyRecord, UserProfile, Workout, WorkoutType } from '@/apis/health/health.type'
import {
  GOAL_WORKOUT_TYPES,
  HISTORY_DAYS,
  RESTING_HR_BASELINE,
  WEEKLY_WORKOUT_SESSIONS,
  WORKOUT_INTENSITY,
} from '@/constants/health'
import { clamp } from '@/utils/math'
import { cyrb53, mulberry32 } from '@/utils/random'
import { calculateTargets } from './metrics'

export function todayIso(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

function pick<T>(items: T[], rand: () => number): T {
  return items[Math.floor(rand() * items.length) % items.length]
}

/**
 * Deterministic 90-day history derived purely from the profile: the same profile
 * always produces the same numbers, so a reload never changes the dashboard and
 * the assistant can never contradict what is on screen.
 */
export function generateHistory(profile: UserProfile, endDateIso = todayIso()): DailyRecord[] {
  const seed = cyrb53(profile.id)
  const targets = calculateTargets(profile)
  const endDate = new Date(`${endDateIso}T00:00:00`)

  const wantsActivity =
    profile.goals.includes('increase_activity') || profile.goals.includes('lose_weight')
  const wantsSleep = profile.goals.includes('improve_sleep')
  const wantsNutrition =
    profile.goals.includes('eat_better') || profile.goals.includes('build_muscle')

  const pool = [...new Set(profile.goals.flatMap((goal) => GOAL_WORKOUT_TYPES[goal]))]
  const types: WorkoutType[] = pool.length > 0 ? pool : ['walk', 'cycle', 'strength']

  const startWeight = profile.goals.includes('lose_weight')
    ? profile.weightKg + 2.6
    : profile.goals.includes('build_muscle')
      ? profile.weightKg - 1.4
      : profile.weightKg + 0.4

  const records: DailyRecord[] = []

  for (let dayIndex = 0; dayIndex < HISTORY_DAYS; dayIndex += 1) {
    // A per-day generator keeps every other day stable when the window shifts.
    const rand = mulberry32(seed + dayIndex * 7919)
    const date = subDays(endDate, HISTORY_DAYS - 1 - dayIndex)
    const dateIso = format(date, 'yyyy-MM-dd')
    const isToday = dateIso === endDateIso
    const weekday = getDay(date)
    const isWeekend = weekday === 0 || weekday === 6
    const progress = dayIndex / (HISTORY_DAYS - 1)

    const stepImprovement = (wantsActivity ? 0.9 : 0.95) + (wantsActivity ? 0.14 : 0.08) * progress
    const steps = Math.round(
      clamp(
        targets.steps * stepImprovement * (isWeekend ? 0.8 : 1) * (0.8 + rand() * 0.4),
        1000,
        25000,
      ),
    )

    const sessionChance = WEEKLY_WORKOUT_SESSIONS[profile.activityLevel] / 7
    const workouts: Workout[] = []

    if (rand() < sessionChance * (isWeekend ? 1.2 : 0.95)) {
      const type = pick(types, rand)
      const durationMinutes = Math.round(clamp(25 + rand() * 50, 20, 90))
      const intensity = WORKOUT_INTENSITY[type]
      workouts.push({
        id: `${dateIso}-1`,
        type,
        durationMinutes,
        caloriesBurned: Math.round(durationMinutes * intensity.kcalPerMinute),
        avgHeartRate: Math.round(intensity.heartRate + (rand() - 0.5) * 14),
      })
    }

    const workoutMinutes = workouts.reduce((total, workout) => total + workout.durationMinutes, 0)
    const workoutCalories = workouts.reduce((total, workout) => total + workout.caloriesBurned, 0)

    const activeMinutes = Math.round(clamp(steps / 220 + workoutMinutes * 0.7, 5, 240))
    const distanceM = Math.round(steps * 0.72)
    const caloriesBurned = Math.round(steps * 0.04 + workoutCalories)

    const sleepImprovement = (wantsSleep ? 0.88 : 0.94) + (wantsSleep ? 0.14 : 0.08) * progress
    const totalMinutes = Math.round(
      clamp(
        targets.sleepMinutes * sleepImprovement * (isWeekend ? 1.07 : 1) * (0.88 + rand() * 0.22),
        240,
        660,
      ),
    )
    const efficiency = Math.round(clamp(82 + rand() * 13 + (isWeekend ? 1 : 0), 70, 98))
    const deepMinutes = Math.round(totalMinutes * (0.16 + rand() * 0.06))
    const remMinutes = Math.round(totalMinutes * (0.19 + rand() * 0.06))
    const awakeMinutes = Math.round((totalMinutes * (100 - efficiency)) / 100)
    const bedtimeMinutes = 22 * 60 + Math.round(rand() * 100) - (isWeekend ? 0 : 20)
    const bedtime = `${String(Math.floor(bedtimeMinutes / 60) % 24).padStart(2, '0')}:${String(
      bedtimeMinutes % 60,
    ).padStart(2, '0')}`

    const nutritionQuality =
      (wantsNutrition ? 0.9 : 0.95) + (wantsNutrition ? 0.12 : 0.06) * progress
    const calories = Math.round(
      clamp(targets.calories * (isWeekend ? 1.08 : 1) * (0.85 + rand() * 0.3), 1100, 4200),
    )
    const proteinG = Math.round(
      clamp(targets.proteinG * nutritionQuality * (0.75 + rand() * 0.45), 25, 300),
    )
    const fatG = Math.round(clamp(targets.fatG * (0.8 + rand() * 0.45), 20, 180))
    const carbsG = Math.round(clamp((calories - proteinG * 4 - fatG * 9) / 4, 30, 600))
    const waterMl =
      Math.round(
        clamp(targets.waterMl * nutritionQuality * (0.6 + rand() * 0.55), 300, 5000) / 50,
      ) * 50

    const drifted =
      Math.round(
        (startWeight + (profile.weightKg - startWeight) * progress + (rand() - 0.5) * 0.3) * 10,
      ) / 10

    const hrImprovement = wantsActivity ? progress * 3 : progress * 1.5
    const restingHeartRate = Math.round(
      clamp(RESTING_HR_BASELINE[profile.activityLevel] - hrImprovement + (rand() - 0.5) * 6, 45, 85),
    )

    const moodBase =
      (totalMinutes / targets.sleepMinutes) * 2.2 + (steps / targets.steps) * 1.8 + rand() * 0.6

    records.push({
      date: dateIso,
      steps,
      activeMinutes,
      distanceM,
      caloriesBurned,
      restingHeartRate,
      // The latest day matches what the user entered, so the dashboard agrees with the profile.
      weightKg: dayIndex === HISTORY_DAYS - 1 ? profile.weightKg : drifted,
      mood: clamp(Math.round(moodBase), 1, 5) as DailyRecord['mood'],
      sleep: { totalMinutes, deepMinutes, remMinutes, awakeMinutes, efficiency, bedtime },
      // Today is deliberately not logged yet, which exercises the empty states.
      nutrition: isToday
        ? { calories: 0, proteinG: 0, carbsG: 0, fatG: 0, waterMl: 0 }
        : { calories, proteinG, carbsG, fatG, waterMl },
      workouts,
    })
  }

  return records
}

/** Zeroed nutrition means "not logged", never "ate nothing". */
export function hasNutrition(record: DailyRecord): boolean {
  return record.nutrition.calories > 0
}
