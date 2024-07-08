import request from '@/axios'

interface projectInfoResponse {
  name: string
  tag: string
  scheduledTasks: boolean
  hour: number
  AssetCount: number
  root_domains: string[]
  next_time: string
}
export const getProjectInfoApi = (id: string): Promise<IResponse<projectInfoResponse>> => {
  return request.post({ url: '/api/project_aggregation/project/info', data: { id } })
}

interface projectInfoResponse {
  subdomainCount: number
  vulCount: number
}
export const getProjectAssetCountApi = (id: string): Promise<IResponse<projectInfoResponse>> => {
  return request.post({ url: '/api/project_aggregation/project/asset/count', data: { id } })
}
