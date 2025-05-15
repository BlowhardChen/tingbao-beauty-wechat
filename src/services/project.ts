import type { ProjectList } from '@/types/project'
import { http } from '@/utils/request'

// 获取项目列表
export const getProjectList = (data: { appointTypeId: string; name?: string }) => {
  return http<ProjectList[]>({
    url: '/wxapp/appAppointProject/list',
    method: 'POST',
    data,
  })
}
