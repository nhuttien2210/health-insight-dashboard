import { useSyncExternalStore } from 'react'

type PersistedStore = {
  persist: {
    hasHydrated: () => boolean
    onFinishHydration: (callback: () => void) => () => void
  }
}

/**
 * `persist` rehydrates after the first paint. Without this guard a returning user
 * is briefly treated as having no data and bounced back to onboarding.
 */
export function useStoreHydrated(store: PersistedStore): boolean {
  return useSyncExternalStore(
    (onChange) => store.persist.onFinishHydration(onChange),
    () => store.persist.hasHydrated(),
    () => false,
  )
}
