import { userInformationSchema } from '@/apis/dashboard/dashboard.schema'
import type { UserInformation } from '@/apis/dashboard/dashboard.type'
import {
  GOAL_LABEL,
  WORKOUT_INTENSITY,
  type GoalType,
  type WorkoutType,
} from '@/constants/health'
import { formatClock } from '@/utils/format'
import { getBmiCategory, getWellnessBand } from '@/utils/health/metrics'
import { mean, percentOf, standardDeviation } from '@/utils/math'
import {
  along,
  buildRecommendations,
  datesInRange,
  isWeekend,
  jitter,
  roundedMean,
  streakFromEnd,
  trendFrom,
} from '../utils'

const SCENARIO = {
  heightCm: 172,
  startWeightKg: 71,
  weightChangeKg: -1.8,
  stepTarget: 10000,
  stepRatio: 0.95,
  stepSlope: 0.06,
  activeMinutesTarget: 45,
  sleepTargetMinutes: 450,
  sleepRatio: 0.98,
  sleepSlope: 0.02,
  bedtimeCenter: 22.5 * 60,
  bedtimeSpread: 30,
  deepShare: 0.19,
  calorieTarget: 2200,
  calorieRatio: 0.96,
  calorieSlope: -0.03,
  proteinTarget: 120,
  proteinRatio: 1.0,
  carbsTarget: 220,
  fatTarget: 65,
  waterTarget: 2600,
  waterRatio: 1.0,
  logRate: 0.88,
  workoutChance: 0.55,
  workoutTypes: ['run', 'cycle', 'strength'] as WorkoutType[],
  heartBaseline: 62,
  heartSlope: -0.03,
  goals: ['lose_weight', 'eat_better', 'increase_activity'] as GoalType[],
}

export function generateUserInformation(rangeDays: number): UserInformation {
  const scenario = SCENARIO
  const dates = datesInRange(rangeDays)
  const today = dates[dates.length - 1]

  const targets = {
    steps: scenario.stepTarget,
    calories: scenario.calorieTarget,
    proteinG: scenario.proteinTarget,
    carbsG: scenario.carbsTarget,
    fatG: scenario.fatTarget,
    waterMl: scenario.waterTarget,
    sleepMinutes: scenario.sleepTargetMinutes,
    activeMinutes: scenario.activeMinutesTarget,
  }

  const days = dates.map((date, index) => {
    const progress = index / Math.max(rangeDays - 1, 1)
    const weekend = isWeekend(date)

    const steps = jitter(
      scenario.stepTarget * along(scenario.stepRatio, scenario.stepSlope, progress) * (weekend ? 0.82 : 1),
      0, 800, 22000,
    )
    const totalMinutes = jitter(
      scenario.sleepTargetMinutes * along(scenario.sleepRatio, scenario.sleepSlope, progress) + (weekend ? 30 : 0),
      0, 180, 620,
    )
    const deepMinutes = Math.round(totalMinutes * scenario.deepShare)
    const remMinutes = Math.round(totalMinutes * 0.20)

    const workoutType = scenario.workoutTypes[index % scenario.workoutTypes.length]
    const intensity = WORKOUT_INTENSITY[workoutType]
    const durationMinutes = 40

    const hasWorkout = weekend ? true : index % 2 === 0

    const logged = index % 7 !== 6

    return {
      date,
      steps,
      activeMinutes: jitter(steps / 190 + (hasWorkout ? durationMinutes * 0.35 : 0), 0, 0, 180),
      restingHeartRate: jitter(scenario.heartBaseline * along(1, scenario.heartSlope, progress), 0, 44, 92),
      weightKg: Math.round((scenario.startWeightKg + scenario.weightChangeKg * progress) * 10) / 10,
      calories: jitter(
        scenario.calorieTarget * along(scenario.calorieRatio, scenario.calorieSlope, progress) + (weekend ? 140 : 0),
        0, 700, 4500,
      ),
      proteinG: jitter(scenario.proteinTarget * scenario.proteinRatio, 0, 15, 230),
      carbsG: jitter(scenario.carbsTarget, 0, 30, 480),
      fatG: jitter(scenario.fatTarget, 0, 12, 170),
      waterMl: jitter(scenario.waterTarget * scenario.waterRatio, 0, 300, 4800),
      totalMinutes,
      deepMinutes,
      remMinutes,
      lightMinutes: Math.max(totalMinutes - deepMinutes - remMinutes, 0),
      sleepScore: jitter(68 + (totalMinutes - 360) / 9 + scenario.deepShare * 50, 0, 35, 98),
      bedtimeMinutes: jitter(scenario.bedtimeCenter + (weekend ? 35 : 0), 0, 20 * 60, 27 * 60),
      logged,
      workout: hasWorkout
        ? {
            id: `w-${date}`,
            type: workoutType,
            durationMinutes,
            caloriesBurned: Math.round(durationMinutes * intensity.kcalPerMinute),
            avgHeartRate: jitter(intensity.heartRate, 0, 85, 175),
            date,
          }
        : null,
    }
  })

  const logged = days.filter((day) => day.logged)
  const steps = days.map((day) => day.steps)
  const activeMinutes = days.map((day) => day.activeMinutes)
  const sleepMinutes = days.map((day) => day.totalMinutes)
  const sleepScores = days.map((day) => day.sleepScore)
  const calories = logged.map((day) => day.calories)
  const protein = logged.map((day) => day.proteinG)
  const heartRates = days.map((day) => day.restingHeartRate)
  const weights = days.map((day) => day.weightKg)
  const latestWeightKg = weights[weights.length - 1]
  const heightM = scenario.heightCm / 100
  const bmi = Math.round((latestWeightKg / (heightM * heightM)) * 10) / 10
  const avgSteps = roundedMean(steps)
  const avgSleepMinutes = roundedMean(sleepMinutes)
  const avgCalories = roundedMean(calories)
  const avgProteinG = roundedMean(protein)
  const avgWaterMl = roundedMean(logged.map((day) => day.waterMl))
  const avgHeartRate = roundedMean(heartRates)
  const stepPercent = percentOf(avgSteps, scenario.stepTarget)
  const sleepPercent = percentOf(avgSleepMinutes, scenario.sleepTargetMinutes)
  const caloriePercent = percentOf(avgCalories, scenario.calorieTarget)
  const wellnessScore = Math.round((stepPercent + sleepPercent + Math.min(caloriePercent, 100)) / 3)
  const spark = (values: number[]) => values.slice(-Math.min(14, values.length))
  const bestDay = days.reduce((best, day) => (day.steps > best.steps ? day : best))
  const recentWorkouts = days.flatMap((day) => (day.workout ? [day.workout] : [])).slice(-5).reverse()

  const breakdownMap = new Map<WorkoutType, { sessions: number; minutes: number }>()
  for (const day of days) {
    if (!day.workout) continue
    const entry = breakdownMap.get(day.workout.type) ?? { sessions: 0, minutes: 0 }
    entry.sessions += 1
    entry.minutes += day.workout.durationMinutes
    breakdownMap.set(day.workout.type, entry)
  }

  const summary = {
    days: rangeDays,
    avgSteps,
    avgActiveMinutes: roundedMean(activeMinutes),
    avgCaloriesBurned: roundedMean(days.map((day) => (day.workout?.caloriesBurned ?? 0) + 1500)),
    avgSleepMinutes,
    avgSleepScore: roundedMean(sleepScores),
    avgCalories,
    avgProteinG,
    avgWaterMl,
    avgRestingHeartRate: avgHeartRate,
    latestWeightKg,
    totalWorkouts: days.filter((day) => day.workout).length,
  }

  const goalProgress = scenario.goals.map((goal) => {
    const byGoal: Record<GoalType, { metricLabel: string; current: number; target: number; unit: string }> = {
      increase_activity: {
        metricLabel: 'Average daily steps',
        current: avgSteps,
        target: scenario.stepTarget,
        unit: 'steps',
      },
      improve_sleep: {
        metricLabel: 'Average sleep per night',
        current: avgSleepMinutes,
        target: scenario.sleepTargetMinutes,
        unit: 'minutes',
      },
      build_muscle: {
        metricLabel: 'Average protein intake',
        current: avgProteinG,
        target: scenario.proteinTarget,
        unit: 'g',
      },
      eat_better: {
        metricLabel: 'Average calories eaten',
        current: avgCalories,
        target: scenario.calorieTarget,
        unit: 'kcal',
      },
      lose_weight: {
        metricLabel: 'Latest weight',
        current: latestWeightKg,
        target: Math.round((scenario.startWeightKg + Math.min(scenario.weightChangeKg, -0.4)) * 10) / 10,
        unit: 'kg',
      },
    }
    const item = byGoal[goal]
    return {
      goal,
      label: GOAL_LABEL[goal],
      metricLabel: item.metricLabel,
      current: item.current,
      target: item.target,
      unit: item.unit,
      percentComplete: percentOf(item.current, item.target),
    }
  })

  const recommendations = buildRecommendations({
    avgSteps,
    stepTarget: scenario.stepTarget,
    avgSleepMinutes,
    sleepTargetMinutes: scenario.sleepTargetMinutes,
    avgProteinG,
    proteinTarget: scenario.proteinTarget,
    avgWaterMl,
    waterTarget: scenario.waterTarget,
    workoutDays: summary.totalWorkouts,
    rangeDays,
  })

  const todayRow = days[days.length - 1]
  const loggedToday = todayRow?.logged ?? false

  return userInformationSchema.parse({
    overview: {
      rangeDays,
      today,
      wellnessScore,
      wellnessBand: getWellnessBand(wellnessScore),
      bmi,
      bmiCategory: getBmiCategory(bmi),
      targets,
      summary,
      metrics: [
        {
          key: 'steps',
          label: 'Daily steps',
          value: avgSteps,
          unit: 'avg steps',
          target: scenario.stepTarget,
          percent: stepPercent,
          trend: trendFrom(steps),
          sparkline: spark(steps),
          accent: 'activity',
          higherIsBetter: true,
          format: 'number',
        },
        {
          key: 'sleep',
          label: 'Sleep per night',
          value: avgSleepMinutes,
          unit: 'avg',
          target: scenario.sleepTargetMinutes,
          percent: sleepPercent,
          trend: trendFrom(sleepMinutes),
          sparkline: spark(sleepMinutes),
          accent: 'sleep',
          higherIsBetter: true,
          format: 'duration',
        },
        {
          key: 'calories',
          label: 'Calories eaten',
          value: avgCalories,
          unit: 'avg kcal',
          target: scenario.calorieTarget,
          percent: caloriePercent,
          trend: trendFrom(calories),
          sparkline: spark(calories),
          accent: 'nutrition',
          higherIsBetter: true,
          format: 'number',
        },
        {
          key: 'restingHeartRate',
          label: 'Resting heart rate',
          value: avgHeartRate,
          unit: 'avg bpm',
          target: null,
          percent: null,
          trend: trendFrom(heartRates),
          sparkline: spark(heartRates),
          accent: 'heart',
          higherIsBetter: false,
          format: 'number',
        },
      ],
      weightSeries: days.map((day) => ({ date: day.date, weightKg: day.weightKg })),
      weightTrend: trendFrom(weights),
      stepStreak: streakFromEnd(days.map((day) => day.steps >= scenario.stepTarget)),
      loggedNutritionToday: loggedToday,
    },
    activity: {
      rangeDays,
      stepTarget: scenario.stepTarget,
      activeMinutesTarget: scenario.activeMinutesTarget,
      summary,
      stepsTrend: trendFrom(steps),
      activeMinutesTrend: trendFrom(activeMinutes),
      restingHeartRateTrend: trendFrom(heartRates),
      series: days.map((day) => ({
        date: day.date,
        steps: day.steps,
        activeMinutes: day.activeMinutes,
      })),
      stepStreak: streakFromEnd(days.map((day) => day.steps >= scenario.stepTarget)),
      daysAtTarget: days.filter((day) => day.steps >= scenario.stepTarget).length,
      bestDay: { date: bestDay.date, steps: bestDay.steps, activeMinutes: bestDay.activeMinutes },
      recentWorkouts,
      breakdown: [...breakdownMap.entries()]
        .map(([type, value]) => ({ type, ...value }))
        .sort((left, right) => right.minutes - left.minutes),
    },
    sleep: {
      rangeDays,
      sleepTargetMinutes: scenario.sleepTargetMinutes,
      summary,
      durationTrend: trendFrom(sleepMinutes),
      scoreTrend: trendFrom(sleepScores),
      series: days.map((day) => ({
        date: day.date,
        totalMinutes: day.totalMinutes,
        deepMinutes: day.deepMinutes,
        remMinutes: day.remMinutes,
        lightMinutes: day.lightMinutes,
        score: day.sleepScore,
        bedtimeMinutes: day.bedtimeMinutes,
      })),
      nightsAtTarget: days.filter((day) => day.totalMinutes >= scenario.sleepTargetMinutes).length,
      sleepStreak: streakFromEnd(days.map((day) => day.totalMinutes >= scenario.sleepTargetMinutes)),
      bedtimeConsistencyMinutes: Math.round(standardDeviation(days.map((day) => day.bedtimeMinutes))),
      avgBedtime: formatClock(mean(days.map((day) => day.bedtimeMinutes))),
    },
    nutrition: {
      rangeDays,
      targets,
      summary,
      caloriesTrend: trendFrom(calories),
      proteinTrend: trendFrom(protein),
      series: logged.map((day) => ({
        date: day.date,
        calories: day.calories,
        proteinG: day.proteinG,
        carbsG: day.carbsG,
        fatG: day.fatG,
        waterMl: day.waterMl,
      })),
      loggedDays: logged.length,
      daysWithinCalorieRange: logged.filter(
        (day) => Math.abs(day.calories - scenario.calorieTarget) <= scenario.calorieTarget * 0.1,
      ).length,
      avgMacroSplit: {
        proteinG: avgProteinG,
        carbsG: roundedMean(logged.map((day) => day.carbsG)),
        fatG: roundedMean(logged.map((day) => day.fatG)),
      },
      today: loggedToday
        ? {
            date: today,
            calories: todayRow.calories,
            proteinG: todayRow.proteinG,
            carbsG: todayRow.carbsG,
            fatG: todayRow.fatG,
            waterMl: todayRow.waterMl,
          }
        : null,
    },
    goals: {
      rangeDays,
      goalProgress,
      recommendations,
      isAllOnTrack: recommendations.length === 0,
    },
  })
}
