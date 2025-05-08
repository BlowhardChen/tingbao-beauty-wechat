import type { ProjectList } from '@/types/project'
import { http } from '@/utils/request'

// 获取项目列表
export const getProjectList = (appointTypeId?: number | string) => {
  return http<ProjectList[]>({
    url: '/wxapp/appAppointProject/list',
    method: 'POST',
    data: { appointTypeId },
  })
}
