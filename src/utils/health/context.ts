import type { UserInformation } from '@/apis/dashboard/dashboard.type'
import type { HealthContext } from '@/apis/assistant/assistant.type'

export function buildContextFromUserInformation(data: UserInformation): HealthContext {
  const { overview, activity, sleep, goals } = data

  const snapshot = {
    days: overview.summary.days,
    avgSteps: overview.summary.avgSteps,
    avgActiveMinutes: overview.summary.avgActiveMinutes,
    avgSleepMinutes: overview.summary.avgSleepMinutes,
    avgSleepScore: overview.summary.avgSleepScore,
    avgCalories: overview.summary.avgCalories,
    avgProteinG: overview.summary.avgProteinG,
    avgWaterMl: overview.summary.avgWaterMl,
    avgRestingHeartRate: overview.summary.avgRestingHeartRate,
    latestWeightKg: overview.summary.latestWeightKg,
    totalWorkouts: overview.summary.totalWorkouts,
  }

  const metricTrend = (key: string) =>
    overview.metrics.find((m) => m.key === key)?.trend ?? null

  return {
    generatedAt: overview.today,
    profile: {
      name: 'User',
      age: 0,
      sex: '',
      heightCm: 0,
      weightKg: overview.summary.latestWeightKg,
      activityLevel: '',
      goals: goals.goalProgress.map((g) => g.label),
      bmi: overview.bmi,
      bmiCategory: overview.bmiCategory,
    },
    targets: {
      steps: overview.targets.steps,
      calories: overview.targets.calories,
      proteinG: overview.targets.proteinG,
      waterMl: overview.targets.waterMl,
      sleepMinutes: overview.targets.sleepMinutes,
      activeMinutes: overview.targets.activeMinutes,
    },
    last7: snapshot,
    last30: snapshot,
    previous7: snapshot,
    trends: {
      steps: metricTrend('steps'),
      sleepMinutes: metricTrend('sleep'),
      calories: metricTrend('calories'),
      restingHeartRate: metricTrend('restingHeartRate'),
      weightKg: overview.weightTrend,
    },
    goalProgress: goals.goalProgress.map((g) => ({
      goal: g.label,
      metric: g.metricLabel,
      current: g.current,
      target: g.target,
      percentComplete: g.percentComplete,
    })),
    streaks: {
      stepGoal: overview.stepStreak,
      sleepGoal: sleep.sleepStreak,
    },
    recentWorkouts: activity.recentWorkouts.slice(0, 5).map((w) => ({
      date: w.date,
      type: w.type,
      durationMinutes: w.durationMinutes,
      caloriesBurned: w.caloriesBurned,
    })),
    recommendations: goals.recommendations.map((r) => ({
      title: r.title,
      reason: r.reason,
    })),
    wellnessScore: overview.wellnessScore,
    missingData: [],
  }
}
