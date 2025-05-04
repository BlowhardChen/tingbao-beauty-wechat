import { http } from '@/utils/request'

export const apiGetFullTimes = (dateKey: string) =>
  http<{ token: string }>({
    url: '/api/login',
    method: 'POST',
    data: { dateKey },
  })
