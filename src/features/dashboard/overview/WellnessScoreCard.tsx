import { Flame, Gauge, Sparkles } from 'lucide-react'
import type { DashboardOverview } from '@/apis/dashboard/dashboard.type'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useAssistantStore } from '@/features/assistant/stores/useAssistantStore'
import { cn } from '@/libs/cn'

const BAND_TONE: Record<DashboardOverview['wellnessBand'], string> = {
  excellent: 'text-success',
  good: 'text-success',
  fair: 'text-warning',
  'needs attention': 'text-destructive',
}

type WellnessScoreCardProps = {
  overview: DashboardOverview
}

export function WellnessScoreCard({ overview }: WellnessScoreCardProps) {
  const openAssistant = useAssistantStore((state) => state.open)

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Gauge className="text-primary size-4" aria-hidden />
          Wellness score
        </CardTitle>
        <CardDescription>
          Activity, sleep and nutrition adherence over the selected period.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-end gap-3">
          <span className="text-4xl leading-none font-semibold tabular-nums">
            {overview.wellnessScore}
          </span>
          <span className={cn('pb-1 text-sm font-medium capitalize', BAND_TONE[overview.wellnessBand])}>
            {overview.wellnessBand}
          </span>
        </div>

        <Progress value={overview.wellnessScore} aria-label={`Wellness score ${overview.wellnessScore} out of 100`} />

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground text-xs">BMI</dt>
            <dd className="font-medium tabular-nums">
              {overview.bmi} <span className="text-muted-foreground capitalize">{overview.bmiCategory}</span>
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs">Step streak</dt>
            <dd className="flex items-center gap-1 font-medium tabular-nums">
              <Flame className="text-warning size-3.5" aria-hidden />
              {overview.stepStreak} {overview.stepStreak === 1 ? 'day' : 'days'}
            </dd>
          </div>
        </dl>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => openAssistant('How am I progressing?')}
        >
          <Sparkles className="size-3.5" />
          Ask about my progress
        </Button>
      </CardContent>
    </Card>
  )
}
