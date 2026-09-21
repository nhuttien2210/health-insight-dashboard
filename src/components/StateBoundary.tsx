import type { ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { toAppError } from '@/utils/error'

type StateBoundaryProps = {
  isPending: boolean
  isError: boolean
  error?: unknown
  isEmpty?: boolean
  onRetry?: () => void
  skeleton: ReactNode
  empty?: ReactNode
  children: ReactNode
}

/** Loading, error and empty are handled once here, not in every card. */
export function StateBoundary({
  isPending,
  isError,
  error,
  isEmpty = false,
  onRetry,
  skeleton,
  empty,
  children,
}: StateBoundaryProps) {
  if (isPending) return <>{skeleton}</>

  if (isError) {
    const appError = toAppError(error)
    return (
      <Alert variant="destructive" role="alert">
        <AlertTriangle />
        <AlertTitle>We couldn't load this</AlertTitle>
        <AlertDescription className="flex flex-col items-start gap-3">
          <span>{appError.message}</span>
          {onRetry ? (
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="size-3.5" />
              Try again
            </Button>
          ) : null}
        </AlertDescription>
      </Alert>
    )
  }

  if (isEmpty && empty) return <>{empty}</>

  return <>{children}</>
}
