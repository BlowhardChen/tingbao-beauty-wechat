import type { GlobalUser } from '@/types/user'
import { http } from '@/utils/request'

export const login = (data: any) => {
  return http<{ token: string; userinfo: GlobalUser }>({
    url: '/wxapp/login',
    method: 'POST',
    data,
  })
}
