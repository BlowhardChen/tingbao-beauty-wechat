import { useUserInfoStore } from '@/stores'

/** API 基础地址 */
const BASE_URL = 'https://tingbaomeiye.online/api'

/** 后端响应结构泛型 */
interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

/** 扩展 uni 请求类型 */
type RequestOptions = UniApp.RequestOptions & {
  silent?: boolean
}

/** 请求拦截器 */
const requestInterceptor = {
  invoke(options: RequestOptions) {
    const store = useUserInfoStore()

    // 补全 URL
    if (!/^https?:\/\//.test(options.url)) {
      options.url = BASE_URL + options.url
    }

    // 拼接 GET 请求参数到 URL（仅 GET 时处理）
    if (options.method?.toUpperCase() === 'GET' && options.data) {
      const query = Object.entries(options.data)
        .filter(([, value]) => value != null)
        .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val as string)}`)
        .join('&')
      options.url += (options.url.includes('?') ? '&' : '?') + query
      delete options.data
    }

    options.timeout ??= 60000
    options.header = {
      'source-client': 'miniprogram',
      Authorization: store.token ? `Bearer ${store.token}` : '',
      ...options.header,
    }

    return options
  },
}

/** 响应拦截器 */
const responseInterceptor = {
  returnValue(res: UniApp.RequestSuccessCallbackResult) {
    const status = res.statusCode
    const data = res.data as ApiResponse

    if (status === 401 || data?.code === 401) {
      handleTokenExpired()
      return Promise.reject({ code: 401, msg: '请重新登录' })
    }

    if (status < 200 || status >= 300 || typeof data !== 'object') {
      return Promise.reject({
        code: status,
        msg: `请求失败 [${status}]`,
      })
    }

    return data.code === 200 ? data.data : Promise.reject(data)
  },
}

/** Token 失效处理 */
function handleTokenExpired() {
  const store = useUserInfoStore()
  store.removeUserInfoData()
  uni.reLaunch({ url: '/pages/index/index' })
}

/** 错误提示 */
function showError(message = '请求失败，请重试') {
  uni.showToast({
    icon: 'none',
    title: message,
    duration: 2000,
  })
}

/** 注册拦截器 */
uni.addInterceptor('request', {
  invoke: requestInterceptor.invoke,
})
uni.addInterceptor('uploadFile', requestInterceptor)

/** 封装带类型的请求函数 */
export function http<T = any>(options: RequestOptions): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const { silent } = options

    uni.request({
      ...options,
      success: async (res) => {
        try {
          const data = await responseInterceptor.returnValue(res)
          resolve(data as T)
        } catch (err) {
          if (!silent) showError((err as any)?.msg)
          reject(err)
        }
      },
      fail: (err) => {
        if (!silent) showError('网络连接失败，请检查网络')
        reject(err)
      },
    })
  })
}
