import { useEffect } from 'react'
import { selectTheme, useThemeStore } from '@/stores/useThemeStore'

/** Mirrors the stored theme onto the document, which Tailwind reads for dark mode. */
export function useApplyTheme(): void {
  const theme = useThemeStore(selectTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
}
