// 基础请求配置（扩展 uni-app 原生类型）
declare type RequestConfig = UniApp.RequestOptions & {
  baseURL?: string
  // 可添加其他自定义配置项
}

// 统一响应结构（根据后端接口调整）
declare interface ApiResponse<T = any> {
  code: number
  data: T
  message?: string
}

// 错误处理类型
declare interface RequestError extends Error {
  code?: number
  message: string
}
