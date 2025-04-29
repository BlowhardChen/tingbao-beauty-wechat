// 用户状态信息
export interface UserState {
  token: string | undefined
  userInfo: GlobalUser | any
}

// 用户详细信息
export interface GlobalUser {
  id: number
  name: string
  mobile: string
}
