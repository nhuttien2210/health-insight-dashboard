import { ActivityTrendCard } from '../components/activity/ActivityTrendCard'
import { RecentWorkoutsCard } from '../components/activity/RecentWorkoutsCard'

export function ActivitySection() {
  return (
    <section aria-label="Activity" className="grid gap-4 lg:grid-cols-3">
      <ActivityTrendCard className="lg:col-span-2" />
      <RecentWorkoutsCard />
    </section>
  )
}
