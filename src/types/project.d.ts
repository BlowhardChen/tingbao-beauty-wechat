export interface ProjectState {
  projectInfo: ProjectList | null
}

// 项目列表
export interface ProjectList {
  projectId: number
  status: string
  name: string
  price: number
  imageUrl: string
  description: string
  durationMinutes: number
  createBy: string
  createTime: string
  updateTime: string
  updateBy: string
  remark: string
}
