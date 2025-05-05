import { http } from '@/utils/request'

export const login = (code: string) => {
  console.log('login', code)
  return http<{ token: string }>({
    url: '/wxapp/login',
    method: 'POST',
    data: { code },
  })
}
