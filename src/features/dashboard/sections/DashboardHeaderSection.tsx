import { format } from 'date-fns'
import { useProfileStore } from '@/stores/useProfileStore'
import { RangeFilter } from '../components/RangeFilter'

export function DashboardHeaderSection() {
  // Only the name is subscribed to, so unrelated profile edits do not re-render this.
  const name = useProfileStore((state) => state.profile?.name ?? '')

  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-muted-foreground text-sm">{format(new Date(), 'EEEE d MMMM')}</p>
        <h1 className="text-2xl font-semibold tracking-tight">
          {name ? `Hello, ${name}` : 'Your health dashboard'}
        </h1>
      </div>
      <RangeFilter />
    </div>
  )
}
