import type { UserState } from '@/types/user'
import { http } from '@/utils/request'

export const login = (code: string) => {
  return http<{ token: string; userinfo: UserState }>({
    url: '/wxapp/login',
    method: 'POST',
    data: { code },
  })
}
