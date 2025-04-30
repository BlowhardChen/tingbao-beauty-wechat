import '@dcloudio/types'
import { useUserInfoStore } from '@/stores'

/** API 基础地址 */
const BASE_URL = ''

/** 后端响应结构泛型 (根据实际接口调整) */
interface ApiResponse<T = any> {
  code: number // 实际类型需确认 (number/string)
  msg: string
  data: T
}

/** 扩展 uni 请求类型 */
type RequestOptions = UniApp.RequestOptions & {
  /** 是否静默请求 (不显示错误提示) */
  silent?: boolean
}

/** 请求拦截器 */
const requestInterceptor = {
  invoke(options: RequestOptions) {
    // 1. 自动补全基础路径
    if (!options.url.startsWith('http')) {
      options.url = BASE_URL + options.url
    }

    // 2. 合并超时时间 (小程序默认 60s)
    options.timeout = options.timeout || 60000

    // 3. 添加客户端标识
    options.header = {
      'source-client': 'miniprogram', // 微信小程序标准命名
      ...options.header,
    }

    // 4. 自动携带 Token
    const { token } = useUserInfoStore()
    if (token) {
      options.header.Authorization = `Bearer ${token}`
    }

    return options
  },
}

/** 响应拦截器 */
const responseInterceptor = {
  returnValue(res: UniApp.RequestSuccessCallbackResult) {
    // 统一处理 HTTP 状态码
    if (res.statusCode === 401) {
      handleTokenExpired()
      return Promise.reject({ code: 401, msg: '请重新登录' })
    }

    if (res.statusCode < 200 || res.statusCode >= 300) {
      return Promise.reject({
        code: res.statusCode,
        msg: `网络请求失败 [${res.statusCode}]`,
      })
    }

    // 处理业务状态码 (需与后端对齐)
    const data = res.data as ApiResponse
    switch (data.code) {
      case 200: // 业务成功
        return data.data
      case 401: // Token 失效 (与 HTTP 401 重复时可移除)
        handleTokenExpired()
        return Promise.reject(data)
      default: // 其他业务错误
        return Promise.reject(data)
    }
  },
}

/** Token 失效统一处理 */
function handleTokenExpired() {
  const store = useUserInfoStore()
  store.removeUserInfoData()
  uni.reLaunch({ url: '/pages/index/index' }) // 完全重启到登录页
}

// 注册拦截器
uni.addInterceptor('request', {
  ...requestInterceptor,
  ...responseInterceptor,
})
uni.addInterceptor('uploadFile', requestInterceptor)

/** 封装带类型提示的请求函数 */
export function http<T = any>(options: RequestOptions) {
  return new Promise<T>((resolve, reject) => {
    // 静默请求不显示通用错误
    if (!options.silent) {
      options.fail = (err) => {
        showError('网络连接失败，请检查网络')
        reject(err)
      }
    }

    uni.request({
      ...options,
      success: (res) => resolve(res as T),
      fail: reject,
    })
  })
}

/** 统一错误提示 */
function showError(message = '请求失败，请重试') {
  uni.showToast({
    icon: 'none',
    title: message,
    duration: 2000,
  })
}

/** 示例用法 */
interface UserData {
  id: number
  name: string
}

// 带类型的 GET 请求
export const getUsers = () =>
  http<UserData[]>({
    url: '/api/users',
    method: 'GET',
  })

// 带类型的 POST 请求
export const postLogin = (data: { phone: string; code: string }) =>
  http<{ token: string }>({
    url: '/api/login',
    method: 'POST',
    data,
  })
