import type { z } from 'zod'
import type {
  dashboardOverviewSchema,
  metricSnapshotSchema,
  weightPointSchema,
} from './dashboard.schema'

export type MetricSnapshot = z.infer<typeof metricSnapshotSchema>
export type WeightPoint = z.infer<typeof weightPointSchema>
export type DashboardOverview = z.infer<typeof dashboardOverviewSchema>
