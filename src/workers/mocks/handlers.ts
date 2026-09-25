import { http, HttpResponse, delay } from 'msw'
import { dashboardUrls } from '@/apis/dashboard/dashboard.urls'
import { generateUserInformation } from './userInformation'

export const handlers = [
  http.get(dashboardUrls.userInformations, async ({ request }) => {
    await delay(1000)

    const failureRate = Number(import.meta.env.VITE_MOCK_FAILURE_RATE || '0')
    if (failureRate > 0 && Math.random() < failureRate) {
      return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' })
    }

    const url = new URL(request.url)
    const rangeDays = Number(url.searchParams.get('rangeDays') ?? 30)
    const safeRange = Number.isFinite(rangeDays) && rangeDays > 0 ? Math.min(rangeDays, 90) : 30

    return HttpResponse.json(generateUserInformation(safeRange))
  }),
]
