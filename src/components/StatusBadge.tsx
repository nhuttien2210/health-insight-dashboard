import type { ProgressTone } from '@/types/metric'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/libs/cn'

const TONE_CLASS: Record<ProgressTone, string> = {
  'on-track': 'border-success/40 text-success bg-success/10',
  close: 'border-warning/50 text-warning bg-warning/10',
  behind: 'border-destructive/40 text-destructive bg-destructive/10',
}

const TONE_LABEL: Record<ProgressTone, string> = {
  'on-track': 'On track',
  close: 'Close',
  behind: 'Behind',
}

type StatusBadgeProps = {
  tone: ProgressTone
  label?: string
  className?: string
}

export function StatusBadge({ tone, label, className }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn('shrink-0 text-[11px]', TONE_CLASS[tone], className)}>
      {label ?? TONE_LABEL[tone]}
    </Badge>
  )
}
