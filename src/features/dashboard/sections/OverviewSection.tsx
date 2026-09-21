import { useDashboardOverviewQuery } from '@/apis/dashboard/dashboard.query'
import { StateBoundary } from '@/components/StateBoundary'
import { Skeleton } from '@/components/ui/skeleton'
import { RANGE_COMPARISON_LABEL } from '@/constants/range'
import { useRangeDays } from '../hooks/useRangeDays'
import { OverviewMetricCard } from '../components/overview/OverviewMetricCard'
import { WellnessScoreCard } from '../components/overview/WellnessScoreCard'

export function OverviewSection() {
  const rangeDays = useRangeDays()
  const { data, isPending, isError, error, refetch } = useDashboardOverviewQuery(rangeDays)

  return (
    <section aria-label="Overview">
      <StateBoundary
        isPending={isPending}
        isError={isError}
        error={error}
        onRetry={refetch}
        skeleton={
          <div className="grid gap-4 lg:grid-cols-3">
            <Skeleton className="h-64 rounded-xl" />
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-40 rounded-xl" />
              ))}
            </div>
          </div>
        }
      >
        {data ? (
          <div className="grid gap-4 lg:grid-cols-3">
            <WellnessScoreCard overview={data} />
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
              {data.metrics.map((metric) => (
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
    </section>
  )
}
