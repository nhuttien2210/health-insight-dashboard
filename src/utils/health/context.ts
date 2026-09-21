import type { HealthContext } from '@/apis/assistant/assistant.type'
import type { DailyRecord, UserProfile } from '@/apis/health/health.type'
import { ACTIVITY_LEVEL_LABEL, GOAL_LABEL, WORKOUT_LABEL } from '@/constants/health'
import { roundTo } from '@/utils/math'
import { summarizePeriod } from './aggregate'
import { hasNutrition } from './generateHistory'
import { buildGoalProgress, buildRecommendations } from './goals'
import {
  calculateBmi,
  calculateStreak,
  calculateTargets,
  calculateTrend,
  calculateWellnessScore,
  getBmiCategory,
} from './metrics'

function toSnapshot(records: DailyRecord[], profile: UserProfile) {
  const summary = summarizePeriod(records, profile)

  return {
    days: summary.days,
    avgSteps: summary.avgSteps,
    avgActiveMinutes: summary.avgActiveMinutes,
    avgSleepMinutes: summary.avgSleepMinutes,
    avgSleepScore: summary.avgSleepScore,
    avgCalories: summary.avgCalories,
    avgProteinG: summary.avgProteinG,
    avgWaterMl: summary.avgWaterMl,
    avgRestingHeartRate: summary.avgRestingHeartRate,
    latestWeightKg: roundTo(summary.latestWeightKg, 1),
    totalWorkouts: summary.totalWorkouts,
  }
}

/**
 * Pre-computed snapshot rather than raw records: the model is asked to explain
 * numbers, never to calculate them, and every figure here is the same one the
 * dashboard renders.
 */
export function buildHealthContext(profile: UserProfile, history: DailyRecord[]): HealthContext {
  const targets = calculateTargets(profile)
  const last7 = history.slice(-7)
  const previous7 = history.slice(-14, -7)
  const last30 = history.slice(-30)
  const previous30 = history.slice(-60, -30)
  const bmi = calculateBmi(profile.weightKg, profile.heightCm)
  const summary30 = summarizePeriod(last30, profile)

  const trendOf = (selector: (record: DailyRecord) => number) =>
    calculateTrend(last30.map(selector), previous30.map(selector))

  const missingData: string[] = []
  const today = history.at(-1)
  if (today && !hasNutrition(today)) missingData.push('nutrition and water for today')
  missingData.push('blood pressure, glucose, medication and any clinical history')

  return {
    generatedAt: today?.date ?? '',
    profile: {
      name: profile.name,
      age: profile.age,
      sex: profile.sex,
      heightCm: profile.heightCm,
      weightKg: profile.weightKg,
      activityLevel: ACTIVITY_LEVEL_LABEL[profile.activityLevel],
      goals: profile.goals.map((goal) => GOAL_LABEL[goal]),
      bmi: roundTo(bmi, 1),
      bmiCategory: getBmiCategory(bmi),
    },
    targets: {
      steps: targets.steps,
      calories: targets.calories,
      proteinG: targets.proteinG,
      waterMl: targets.waterMl,
      sleepMinutes: targets.sleepMinutes,
      activeMinutes: targets.activeMinutes,
    },
    last7: toSnapshot(last7, profile),
    last30: toSnapshot(last30, profile),
    previous7: toSnapshot(previous7, profile),
    trends: {
      steps: trendOf((record) => record.steps),
      sleepMinutes: trendOf((record) => record.sleep.totalMinutes),
      calories: trendOf((record) => record.nutrition.calories),
      restingHeartRate: trendOf((record) => record.restingHeartRate),
      weightKg: trendOf((record) => record.weightKg),
    },
    goalProgress: buildGoalProgress(profile, summary30, targets, last30.filter(hasNutrition)).map(
      (goal) => ({
        goal: goal.label,
        metric: goal.metricLabel,
        current: goal.current,
        target: goal.target,
        percentComplete: goal.percentComplete,
      }),
    ),
    streaks: {
      stepGoal: calculateStreak(history, (record) => record.steps >= targets.steps),
      sleepGoal: calculateStreak(
        history,
        (record) => record.sleep.totalMinutes >= targets.sleepMinutes,
      ),
    },
    recentWorkouts: last30
      .flatMap((record) => record.workouts.map((workout) => ({ ...workout, date: record.date })))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5)
      .map((workout) => ({
        date: workout.date,
        type: WORKOUT_LABEL[workout.type],
        durationMinutes: workout.durationMinutes,
        caloriesBurned: workout.caloriesBurned,
      })),
    recommendations: buildRecommendations({
      history,
      current: last30,
      previous: previous30,
      summary: summary30,
      targets,
      rangeDays: 30,
    }).map((recommendation) => ({
      title: recommendation.title,
      reason: recommendation.reason,
    })),
    wellnessScore: calculateWellnessScore(last30, profile),
    missingData,
  }
}
