import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/libs/cn'

type EmptyStateProps = {
  icon?: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-10 text-center',
        className,
      )}
    >
      <span className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-full">
        <Icon className="size-5" aria-hidden />
      </span>
      <p className="font-medium">{title}</p>
      <p className="text-muted-foreground max-w-sm text-sm">{description}</p>
      {actionLabel && onAction ? (
        <Button variant="outline" size="sm" className="mt-2" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
