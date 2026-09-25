import { useDashboardQuery } from '@/apis/dashboard/dashboard.query'
import { StateBoundary } from '@/components/StateBoundary'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { RANGE_COMPARISON_LABEL } from '@/constants/range'
import { DashboardSection } from '../components/DashboardSection'
import { useRangeDays } from '../hooks/useRangeDays'
import { OverviewMetricCard } from './OverviewMetricCard'
import { WellnessScoreCard } from './WellnessScoreCard'

function OverviewSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="gap-4">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full max-w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-2 w-full rounded-full" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:col-span-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="gap-3 py-4">
            <CardHeader className="gap-0 px-4">
              <div className="flex items-center gap-2">
                <Skeleton className="size-7 rounded-lg" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 px-4">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-4 w-32" />
              <div className="space-y-1 pt-1">
                <Skeleton className="h-2 w-full rounded-full" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function OverviewSection() {
  const rangeDays = useRangeDays()
  const { data, isPending, isError, error, refetch } = useDashboardQuery(rangeDays)

  return (
    <DashboardSection id="overview">
      <StateBoundary
        isPending={isPending}
        isError={isError}
        error={error}
        onRetry={refetch}
        skeleton={<OverviewSkeleton />}
      >
        {data ? (
          <div className="grid gap-4 md:grid-cols-3">
            <WellnessScoreCard overview={data.overview} />
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:col-span-2">
              {data.overview.metrics.map((metric) => (
                <OverviewMetricCard
                  key={metric.key}
                  metric={metric}
                  comparisonLabel={RANGE_COMPARISON_LABEL[rangeDays]}
                />
              ))}
            </div>
          </div>
        ) : null}
      </StateBoundary>
    </DashboardSection>
  )
}
