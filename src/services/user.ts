import type { GlobalUser } from '@/types/user'
import { http } from '@/utils/request'

export const login = (code: string) => {
  return http<{ token: string; userinfo: GlobalUser }>({
    url: '/wxapp/login',
    method: 'POST',
    data: { code },
  })
}
