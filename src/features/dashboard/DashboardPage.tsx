import { ActivitySection } from './activity/ActivitySection'
import { DashboardHeaderSection } from './components/DashboardHeaderSection'
import { DashboardSectionNav } from './components/DashboardSectionNav'
import { NutritionSection } from './nutrition/NutritionSection'
import { OverviewSection } from './overview/OverviewSection'
import { ProgressSection } from './progress/ProgressSection'
import { RecommendationsSection } from './recommendations/RecommendationsSection'
import { SleepSection } from './sleep/SleepSection'

export function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-360 px-4 py-4 sm:py-6">
      <DashboardHeaderSection />
      <DashboardSectionNav />
      <div className="mt-6 divide-y divide-border/50 *:py-6 sm:*:py-8 first:*:pt-0 last:*:pb-0">
        <OverviewSection />
        <ActivitySection />
        <SleepSection />
        <NutritionSection />
        <ProgressSection />
        <RecommendationsSection />
      </div>
    </div>
  )
}
