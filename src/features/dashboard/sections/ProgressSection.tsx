import { GoalProgressCard } from '../components/goals/GoalProgressCard'
import { WeightTrendCard } from '../components/overview/WeightTrendCard'

export function ProgressSection() {
  return (
    <section aria-label="Progress towards goals" className="grid gap-4 lg:grid-cols-3">
      <WeightTrendCard className="lg:col-span-2" />
      <GoalProgressCard />
    </section>
  )
}
