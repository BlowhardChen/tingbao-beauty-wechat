import type { ProjectList } from '@/types/project'
import { http } from '@/utils/request'

export const getProjectList = (appointTypeId?: string) => {
  return http<ProjectList[]>({
    url: '/wxapp/appAppointProject/list',
    method: 'POST',
    data: { appointTypeId },
  })
}
