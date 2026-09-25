import { userInformationSchema } from './dashboard.schema'
import type { UserInformation } from './dashboard.type'
import { dashboardUrls } from './dashboard.urls'
import { http } from '@/libs/axios/index'
import { AppError } from '@/libs/axios/error'

export async function getUserInformation(
  rangeDays: number,
  signal?: AbortSignal,
): Promise<UserInformation> {
  const { data } = await http.get(dashboardUrls.userInformations, {
    params: { rangeDays },
    signal,
  })

  try {
    return userInformationSchema.parse(data)
  } catch (error) {
    throw new AppError('INVALID_RESPONSE', 'The health information response was not valid.', error)
  }
}
