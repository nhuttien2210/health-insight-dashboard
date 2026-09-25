import type { DailyRecord } from '@/apis/dashboard/health/health.type'
import { format } from 'date-fns'

export function todayIso(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function hasNutrition(record: DailyRecord): boolean {
  return record.nutrition.calories > 0
}
