import request from '@/axios'
import { ProjectData } from './types'

export const getProjectDataApi = (): Promise<IResponse<ProjectData[]>> => {
  return request.get({ url: '/api/project/data' })
}
