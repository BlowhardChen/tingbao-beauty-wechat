import type { ProjectList, ProjectState } from '@/types/project'
import { defineStore } from 'pinia'

export const useProjectInfoStore = defineStore('project-store', {
  state: (): ProjectState => ({
    projectInfo: null,
  }),

  actions: {
    // 存储项目信息
    setProjectInfoData(project: ProjectList) {
      this.projectInfo = project
    },

    // 移除项目信息
    removeProjectInfoData() {
      this.projectInfo = null
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
