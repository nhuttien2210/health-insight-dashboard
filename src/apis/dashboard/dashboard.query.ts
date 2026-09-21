import { createSummaryQuery } from '@/libs/createSummaryQuery'
import { getDashboardOverview } from './dashboard.service'

export const { keys: dashboardKeys, useSummaryQuery: useDashboardOverviewQuery } =
  createSummaryQuery('dashboard', getDashboardOverview)
