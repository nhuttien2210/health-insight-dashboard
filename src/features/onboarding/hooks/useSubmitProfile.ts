import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { dashboardKeys } from '@/apis/dashboard/dashboard.query'
import { getDashboardOverview } from '@/apis/dashboard/dashboard.service'
import type { ProfileFormValues } from '@/apis/profile/profile.type'
import { DEFAULT_RANGE_DAYS } from '@/constants/range'
import { useAssistantStore } from '@/features/assistant/stores/useAssistantStore'
import { useProfileStore } from '@/stores/useProfileStore'

export function useSubmitProfile() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const saveProfile = useProfileStore((state) => state.saveProfile)
  const clearConversation = useAssistantStore((state) => state.clearConversation)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submitProfile(values: ProfileFormValues) {
    setIsSubmitting(true)
    const profile = saveProfile(values)

    // Cached numbers and past answers both belong to the previous profile.
    queryClient.clear()
    clearConversation()

    try {
      await queryClient.prefetchQuery({
        queryKey: dashboardKeys.summary(profile.id, DEFAULT_RANGE_DAYS),
        queryFn: () => getDashboardOverview(profile, DEFAULT_RANGE_DAYS),
      })
    } finally {
      setIsSubmitting(false)
      navigate('/', { replace: true })
    }
  }

  return { submitProfile, isSubmitting }
}
