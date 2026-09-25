import { lazy, Suspense } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { HeartPulse, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { selectTheme, useThemeStore } from '@/stores/useThemeStore'

const FloatingAssistant = lazy(() =>
  import('@/features/assistant/FloatingAssistant').then((module) => ({
    default: module.FloatingAssistant,
  })),
)

export function AppLayout() {
  const theme = useThemeStore(selectTheme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <header className="bg-background/85 sticky top-0 z-40 border-b backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-360 items-center justify-between gap-3 px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
              <HeartPulse className="size-4.5" aria-hidden />
            </span>
            <span className="sm:hidden font-semibold">HI</span>
            <span className="hidden sm:inline">Health Insight</span>
          </Link>

          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle dark mode">
                  {theme === 'dark' ? <Sun /> : <Moon />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle dark mode</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>

      <div className="flex-1">
        <Outlet />
      </div>

      <ScrollToTop />

      <Suspense fallback={null}>
        <FloatingAssistant />
      </Suspense>
    </div>
  )
}
