import type { z } from 'zod'
import type { metricSnapshotSchema, overviewSchema, userInformationSchema, weightPointSchema } from './dashboard.schema'

export type UserInformation = z.infer<typeof userInformationSchema>
export type DashboardOverview = z.infer<typeof overviewSchema>
export type MetricSnapshot = z.infer<typeof metricSnapshotSchema>
export type WeightPoint = z.infer<typeof weightPointSchema>
export type BmiCategory = DashboardOverview['bmiCategory']
export type WellnessBand = DashboardOverview['wellnessBand']
