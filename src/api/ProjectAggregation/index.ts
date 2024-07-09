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

interface projectVulLevelInfoResponse {
  _id: string
  count: number
}
export const getProjectVulLevelCountApi = (
  id: string
): Promise<IResponse<projectVulLevelInfoResponse[]>> => {
  return request.post({ url: '/api/project_aggregation/project/vul/statistics', data: { id } })
}

interface projectVulLevelInfoResponse {
  _id: string
  count: number
}

type VulData = {
  url: string
  vulname: string
  level: string
  time: string
  matched: string
}

interface VulDataResponse {
  list: VulData[]
}
export const getProjectVulDataApi = (id: string): Promise<IResponse<VulDataResponse>> => {
  return request.post({ url: '/api/project_aggregation/project/vul/data', data: { id } })
}
