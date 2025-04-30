import { defineStore } from 'pinia'
import type { GlobalUser, UserState } from '../../types/user'

export const useUserInfoStore = defineStore('user-store', {
  state: (): UserState => ({
    token: '',
    userInfo: null,
  }),

  actions: {
    // 存储toke
    setToken(token: string) {
      this.token = token
    },

    // 移除token
    removeToken() {
      this.token = ''
    },

    // 存储用户信息
    setUserInfoData(user: GlobalUser) {
      this.userInfo = user
    },

    // 移除用户信息
    removeUserInfoData() {
      this.userInfo = null
    },
  },

  // pinia持久化
  persist: {
    storage: {
      getItem(key) {
        return uni.getStorageSync(key)
      },
      setItem(key, value) {
        uni.setStorageSync(key, value)
      },
    },
  },
})
