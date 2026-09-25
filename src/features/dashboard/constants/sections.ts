import {
  Activity,
  LayoutDashboard,
  Lightbulb,
  Moon,
  TrendingUp,
  Utensils,
  type LucideIcon,
} from 'lucide-react'

export const DASHBOARD_SECTIONS: {
  id: string
  title: string
  shortTitle: string
  description: string
  icon: LucideIcon
}[] = [
  {
    id: 'overview',
    title: 'Overview',
    shortTitle: 'Overview',
    description: 'Your wellness score and headline metrics for this period.',
    icon: LayoutDashboard,
  },
  {
    id: 'activity',
    title: 'Activity',
    shortTitle: 'Activity',
    description: 'Daily steps against your target, and recent workouts.',
    icon: Activity,
  },
  {
    id: 'sleep',
    title: 'Sleep',
    shortTitle: 'Sleep',
    description: 'Time asleep, stage mix, and how nights compare.',
    icon: Moon,
  },
  {
    id: 'nutrition',
    title: 'Nutrition',
    shortTitle: 'Nutrition',
    description: 'Calories versus target, and how your macros split.',
    icon: Utensils,
  },
  {
    id: 'progress',
    title: 'Progress',
    shortTitle: 'Progress',
    description: 'Weight trend and how each goal is tracking.',
    icon: TrendingUp,
  },
  {
    id: 'recommendations',
    title: 'Recommendations',
    shortTitle: 'Tips',
    description: 'The largest gaps to close, ranked from your own numbers.',
    icon: Lightbulb,
  },
] as const

export type DashboardSectionId = (typeof DASHBOARD_SECTIONS)[number]['id']

export const DASHBOARD_SECTION_IDS: DashboardSectionId[] = DASHBOARD_SECTIONS.map(
  (section) => section.id,
)

export function isDashboardSectionId(value: string): value is DashboardSectionId {
  return DASHBOARD_SECTION_IDS.includes(value as DashboardSectionId)
}
