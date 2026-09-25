import type { ReactNode } from 'react'
import { ChartCard } from '@/components/ChartCard'
import { StateBoundary } from '@/components/StateBoundary'
import { Skeleton } from '@/components/ui/skeleton'

type TrendChartCardProps<T> = {
  title: string
  description: string
  className?: string
  data: T | undefined
  isPending: boolean
  isError: boolean
  error: unknown
  onRetry: () => void
  isEmpty?: (data: T) => boolean
  empty?: ReactNode
  footer?: (data: T) => ReactNode
  action?: (data: T) => ReactNode
  skeletonClassName?: string
  children: (data: T) => ReactNode
}

export function TrendChartCard<T>({
  title,
  description,
  className,
  data,
  isPending,
  isError,
  error,
  onRetry,
  isEmpty,
  empty,
  footer,
  action,
  skeletonClassName = 'h-[240px] w-full rounded-lg',
  children,
}: TrendChartCardProps<T>) {
  return (
    <ChartCard
      className={className}
      title={title}
      description={description}
      action={data ? action?.(data) : undefined}
      footer={footer ? (data ? footer(data) : null) : undefined}
    >
      <StateBoundary
        isPending={isPending}
        isError={isError}
        error={error}
        onRetry={onRetry}
        isEmpty={data ? Boolean(isEmpty?.(data)) : false}
        skeleton={<Skeleton className={skeletonClassName} />}
        empty={empty}
      >
        {data ? children(data) : null}
      </StateBoundary>
    </ChartCard>
  )
}
