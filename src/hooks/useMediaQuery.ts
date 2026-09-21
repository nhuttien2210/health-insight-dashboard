import { useSyncExternalStore } from 'react'

/**
 * Used to pick the assistant shell (bottom sheet vs floating panel) instead of
 * rendering both and hiding one with CSS.
 */
export function useMediaQuery(query: string): boolean {
  function subscribe(onChange: () => void) {
    const list = window.matchMedia(query)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 768px)')
}
