// 用户状态信息
export interface UserState {
  token: string | undefined
  userInfo: GlobalUser | any
}

// 用户详细信息
export interface GlobalUser {
  userId: number
  nickName: string
  avatar: string
  mobile: string
  createTime: string
  loginDate: string
}
