import { useMemo } from 'react'
import { useDashboardQuery } from '@/apis/dashboard/dashboard.query'
import type { HealthContext } from '@/apis/assistant/assistant.type'
import { buildContextFromUserInformation } from '@/utils/health/context'
import { useRangeDays } from '@/features/dashboard/hooks/useRangeDays'

export function useHealthContext(): HealthContext | null {
  const rangeDays = useRangeDays()
  const { data } = useDashboardQuery(rangeDays)

  return useMemo(() => {
    if (!data) return null
    return buildContextFromUserInformation(data)
  }, [data])
}
