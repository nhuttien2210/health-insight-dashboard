import { useMemo } from 'react'
import type { HealthContext } from '@/apis/assistant/assistant.type'
import { buildHealthContext } from '@/utils/health/context'
import { generateHistory } from '@/utils/health/generateHistory'
import { useProfileStore } from '@/stores/useProfileStore'

/**
 * Rebuilt only when the profile changes. The assistant therefore reads exactly
 * the same history the dashboard renders.
 */
export function useHealthContext(): HealthContext | null {
  const profile = useProfileStore((state) => state.profile)

  return useMemo(() => {
    if (!profile) return null
    return buildHealthContext(profile, generateHistory(profile))
  }, [profile])
}
