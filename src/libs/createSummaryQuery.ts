import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { UserProfile } from '@/apis/health/health.type'
import { useProfileStore } from '@/stores/useProfileStore'

type SummaryFetcher<TData> = (
  profile: UserProfile,
  rangeDays: number,
  signal?: AbortSignal,
) => Promise<TData>

/**
 * Every dashboard section fetches the same way: one profile, one range, its own
 * cache entry. This keeps the five feature query files down to their key scope
 * and their service, and guarantees the profile id is always part of the key so
 * editing the profile can never show stale numbers.
 */
export function createSummaryQuery<TData>(scope: string, fetcher: SummaryFetcher<TData>) {
  const keys = {
    all: [scope] as const,
    summary: (profileId: string, rangeDays: number) =>
      [scope, 'summary', profileId, rangeDays] as const,
  }

  function useSummaryQuery(rangeDays: number) {
    const profile = useProfileStore((state) => state.profile)

    return useQuery({
      queryKey: keys.summary(profile?.id ?? 'anonymous', rangeDays),
      queryFn: ({ signal }) => fetcher(profile!, rangeDays, signal),
      enabled: profile !== null,
      // Switching the range should not blank out charts that are already on screen.
      placeholderData: keepPreviousData,
    })
  }

  return { keys, useSummaryQuery }
}
