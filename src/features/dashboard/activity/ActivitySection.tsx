import { DashboardSection } from '../components/DashboardSection'
import { ActivityTrendCard } from './ActivityTrendCard'
import { RecentWorkoutsCard } from './RecentWorkoutsCard'

export function ActivitySection() {
  return (
    <DashboardSection id="activity">
      <div className="grid gap-4 md:grid-cols-3">
        <ActivityTrendCard className="md:col-span-2" />
        <RecentWorkoutsCard />
      </div>
    </DashboardSection>
  )
}
