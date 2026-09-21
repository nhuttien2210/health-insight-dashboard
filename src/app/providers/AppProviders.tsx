import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useApplyTheme } from '@/hooks/useApplyTheme'
import { QueryProvider } from './QueryProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  useApplyTheme()

  return (
    <QueryProvider>
      <TooltipProvider delayDuration={200}>
        <BrowserRouter>{children}</BrowserRouter>
      </TooltipProvider>
    </QueryProvider>
  )
}
