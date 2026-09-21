import { SleepQualityCard } from '../components/sleep/SleepQualityCard'
import { SleepTrendCard } from '../components/sleep/SleepTrendCard'

export function SleepSection() {
  return (
    <section aria-label="Sleep" className="grid gap-4 lg:grid-cols-3">
      <SleepTrendCard className="lg:col-span-2" />
      <SleepQualityCard />
    </section>
  )
}
