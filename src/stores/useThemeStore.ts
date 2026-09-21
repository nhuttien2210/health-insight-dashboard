import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/constants/storage'

export type Theme = 'light' | 'dark'

type ThemeState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

function systemTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Defaults to the OS preference until the user picks a side. */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: systemTheme(),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
    }),
    { name: STORAGE_KEYS.theme },
  ),
)

export const selectTheme = (state: ThemeState) => state.theme
