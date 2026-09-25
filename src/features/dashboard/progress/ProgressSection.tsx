import { DashboardSection } from '../components/DashboardSection'
import { GoalProgressCard } from './GoalProgressCard'
import { WeightTrendCard } from './WeightTrendCard'

export function ProgressSection() {
  return (
    <DashboardSection id="progress">
      <div className="grid gap-4 md:grid-cols-3">
        <WeightTrendCard className="md:col-span-2" />
        <GoalProgressCard />
      </div>
    </DashboardSection>
  )
}
