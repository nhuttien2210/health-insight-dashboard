import { CalorieTrendCard } from '../components/nutrition/CalorieTrendCard'
import { MacroBalanceCard } from '../components/nutrition/MacroBalanceCard'

export function NutritionSection() {
  return (
    <section aria-label="Nutrition" className="grid gap-4 lg:grid-cols-3">
      <CalorieTrendCard className="lg:col-span-2" />
      <MacroBalanceCard />
    </section>
  )
}
