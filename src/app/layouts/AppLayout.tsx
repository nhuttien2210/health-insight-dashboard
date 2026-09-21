import { lazy, Suspense } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { HeartPulse, Moon, RotateCcw, Sun, UserCog } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useProfileStore } from '@/stores/useProfileStore'
import { selectTheme, useThemeStore } from '@/stores/useThemeStore'

// The assistant pulls in the LLM SDK, so it is kept out of the initial bundle.
const FloatingAssistant = lazy(() =>
  import('@/features/assistant/FloatingAssistant').then((module) => ({
    default: module.FloatingAssistant,
  })),
)

export function AppLayout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const theme = useThemeStore(selectTheme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const name = useProfileStore((state) => state.profile?.name ?? '')
  const resetProfile = useProfileStore((state) => state.resetProfile)

  function handleReset() {
    const confirmed = window.confirm(
      'Reset your profile and generated history? This cannot be undone.',
    )
    if (!confirmed) return
    resetProfile()
    queryClient.clear()
    navigate('/onboarding', { replace: true })
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="bg-background/85 sticky top-0 z-40 border-b backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
              <HeartPulse className="size-4.5" aria-hidden />
            </span>
            <span className="hidden sm:inline">Health Insight</span>
          </Link>

          <div className="flex items-center gap-1">
            {name ? (
              <span className="text-muted-foreground mr-1 hidden text-sm sm:inline">{name}</span>
            ) : null}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle dark mode">
                  {theme === 'dark' ? <Sun /> : <Moon />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle dark mode</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild aria-label="Edit profile">
                  <Link to="/profile">
                    <UserCog />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit profile</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleReset} aria-label="Reset data">
                  <RotateCcw />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset data</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>

      <div className="flex-1">
        <Outlet />
      </div>

      <Suspense fallback={null}>
        <FloatingAssistant />
      </Suspense>
    </div>
  )
}
