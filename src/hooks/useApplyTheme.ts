import { useEffect } from 'react'
import { selectTheme, useThemeStore } from '@/stores/useThemeStore'

export function useApplyTheme(): void {
  const theme = useThemeStore(selectTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')

    root.style.colorScheme = theme
  }, [theme])
}
