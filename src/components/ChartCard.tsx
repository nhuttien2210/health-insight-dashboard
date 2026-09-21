import type { ReactNode } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/libs/cn'

type ChartCardProps = {
  title: string
  description: string
  action?: ReactNode
  footer?: ReactNode
  className?: string
  children: ReactNode
}

export function ChartCard({
  title,
  description,
  action,
  footer,
  className,
  children,
}: ChartCardProps) {
  return (
    <Card className={cn('gap-4', className)}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      <CardContent className="space-y-3">
        {children}
        {footer ? <div className="text-muted-foreground text-xs">{footer}</div> : null}
      </CardContent>
    </Card>
  )
}
