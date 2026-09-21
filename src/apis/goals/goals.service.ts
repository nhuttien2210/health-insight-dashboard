import type { UserProfile } from '@/apis/health/health.type'
import { readPeriod } from '@/apis/health/health.service'
import { simulateLatency } from '@/utils/async'
import { summarizePeriod } from '@/utils/health/aggregate'
import { hasNutrition } from '@/utils/health/generateHistory'
import { buildGoalProgress, buildRecommendations } from '@/utils/health/goals'
import { calculateTargets } from '@/utils/health/metrics'
import { goalsSummarySchema } from './goals.schema'
import type { GoalsSummary } from './goals.type'

export async function getGoalsSummary(
  profile: UserProfile,
  rangeDays: number,
  signal?: AbortSignal,
): Promise<GoalsSummary> {
  await simulateLatency(signal)

  const { history, current, previous } = readPeriod(profile, rangeDays)
  const targets = calculateTargets(profile)
  const summary = summarizePeriod(current, profile)

  const recommendations = buildRecommendations({
    history,
    current,
    previous,
    summary,
    targets,
    rangeDays,
  })

  return goalsSummarySchema.parse({
    rangeDays,
    goalProgress: buildGoalProgress(profile, summary, targets, current.filter(hasNutrition)),
    recommendations,
    isAllOnTrack: recommendations.length === 0,
  })
}
