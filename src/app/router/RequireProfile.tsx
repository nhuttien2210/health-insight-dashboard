import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useStoreHydrated } from '@/hooks/useStoreHydrated'
import { useProfileStore } from '@/stores/useProfileStore'

/** Onboarding-first: no profile means no targets, and without targets nothing can be measured. */
export function RequireProfile({ children }: { children: ReactNode }) {
  const hydrated = useStoreHydrated(useProfileStore)
  const hasProfile = useProfileStore((state) => state.profile !== null)

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center" aria-busy="true">
        <Loader2 className="text-muted-foreground size-6 animate-spin" aria-label="Loading" />
      </div>
    )
  }

  if (!hasProfile) return <Navigate to="/onboarding" replace />

  return <>{children}</>
}
