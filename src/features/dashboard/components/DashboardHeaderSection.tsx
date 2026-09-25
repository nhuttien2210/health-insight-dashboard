import { format } from 'date-fns'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function DashboardHeaderSection() {
  return (
    <div>
      <p className="text-muted-foreground text-xs sm:text-sm">
        {format(new Date(), 'EEEE, d MMMM yyyy')}
      </p>
      <h1 className="mt-0.5 text-xl font-semibold tracking-tight sm:text-2xl">
        {getGreeting()} 👋
      </h1>
      <p className="text-muted-foreground mt-1 text-sm hidden sm:block">
        Here's your health summary for the selected period.
      </p>
    </div>
  )
}
