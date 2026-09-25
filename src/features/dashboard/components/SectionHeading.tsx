import type { LucideIcon } from 'lucide-react'

type SectionHeadingProps = {
  id: string
  title: string
  description: string
  icon?: LucideIcon
}

export function SectionHeading({ id, title, description, icon: Icon }: SectionHeadingProps) {
  return (
    <div className="space-y-1">
      <h2 id={id} className="flex items-center gap-2 text-lg font-semibold tracking-tight">
        {Icon ? (
          <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg">
            <Icon className="size-4" aria-hidden />
          </span>
        ) : null}
        {title}
      </h2>
      <p className="text-muted-foreground text-sm text-pretty">{description}</p>
    </div>
  )
}
