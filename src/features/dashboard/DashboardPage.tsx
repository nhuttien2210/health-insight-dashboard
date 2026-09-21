import { ActivitySection } from './sections/ActivitySection'
import { DashboardHeaderSection } from './sections/DashboardHeaderSection'
import { NutritionSection } from './sections/NutritionSection'
import { OverviewSection } from './sections/OverviewSection'
import { ProgressSection } from './sections/ProgressSection'
import { RecommendationsSection } from './sections/RecommendationsSection'
import { SleepSection } from './sections/SleepSection'

/**
 * The page composes sections and subscribes to nothing itself. Each section owns
 * its query and its slice of state, so a range change or a refetch re-renders
 * only the sections that depend on it.
 */
export function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6">
      <DashboardHeaderSection />
      <OverviewSection />
      <ActivitySection />
      <SleepSection />
      <NutritionSection />
      <ProgressSection />
      <RecommendationsSection />
    </div>
  )
}
