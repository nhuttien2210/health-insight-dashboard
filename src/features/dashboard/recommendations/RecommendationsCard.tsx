import { CheckCircle2, Lightbulb, Sparkles } from 'lucide-react'
import { useDashboardQuery } from '@/apis/dashboard/dashboard.query'
import { EmptyState } from '@/components/EmptyState'
import { StateBoundary } from '@/components/StateBoundary'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAssistantStore } from '@/features/assistant/stores/useAssistantStore'
import { useRangeDays } from '../hooks/useRangeDays'

export function RecommendationsCard({ className }: { className?: string }) {
  const rangeDays = useRangeDays()
  const { data, isPending, isError, error, refetch } = useDashboardQuery(rangeDays)
  const openAssistant = useAssistantStore((state) => state.open)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb className="text-warning size-4" aria-hidden />
          What to focus on
        </CardTitle>
        <CardDescription>
          Rule-based suggestions from your own numbers, ordered by the size of the gap.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <StateBoundary
          isPending={isPending}
          isError={isError}
          error={error}
          onRetry={refetch}
          isEmpty={data?.goals.recommendations.length === 0}
          skeleton={
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          }
          empty={
            <EmptyState
              icon={CheckCircle2}
              title="Everything is on track"
              description="Your recent activity, sleep and nutrition are all within range. Keep it steady."
            />
          }
        >
          <ul className="space-y-3">
            {data?.goals.recommendations.map((recommendation) => (
              <li key={recommendation.id} className="bg-muted/40 rounded-lg border p-3">
                <p className="text-sm font-medium">{recommendation.title}</p>
                <p className="text-muted-foreground mt-1 text-sm">{recommendation.reason}</p>
                <p className="mt-2 text-sm">{recommendation.action}</p>
              </li>
            ))}
          </ul>
        </StateBoundary>

        <Button
          variant="outline"
          size="sm"
          onClick={() => openAssistant('What should I focus on?')}
          className="w-full sm:w-auto"
        >
          <Sparkles className="size-3.5" />
          Discuss this with the assistant
        </Button>
      </CardContent>
    </Card>
  )
}
