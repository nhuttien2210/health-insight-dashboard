import { DashboardSection } from '../components/DashboardSection'
import { CalorieTrendCard } from './CalorieTrendCard'
import { MacroBalanceCard } from './MacroBalanceCard'

export function NutritionSection() {
  return (
    <DashboardSection id="nutrition">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <CalorieTrendCard className="md:col-span-2" />
        <MacroBalanceCard />
      </div>
    </DashboardSection>
  )
}
