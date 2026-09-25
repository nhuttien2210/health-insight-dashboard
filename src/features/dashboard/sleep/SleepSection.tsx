import { DashboardSection } from '../components/DashboardSection'
import { SleepQualityCard } from './SleepQualityCard'
import { SleepTrendCard } from './SleepTrendCard'

export function SleepSection() {
  return (
    <DashboardSection id="sleep">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <SleepTrendCard className="md:col-span-2" />
        <SleepQualityCard />
      </div>
    </DashboardSection>
  )
}
