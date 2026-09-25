import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getUserInformation } from './dashboard.service'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  userInformation: (rangeDays: number) =>
    ['dashboard', 'user-infomations', rangeDays] as const,
}

export function useDashboardQuery(rangeDays: number) {
  return useQuery({
    queryKey: dashboardKeys.userInformation(rangeDays),
    queryFn: ({ signal }) => getUserInformation(rangeDays, signal),
    placeholderData: keepPreviousData,
  })
}
