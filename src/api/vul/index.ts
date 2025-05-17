import request from '@/axios'
import type { vulResultData } from './types'

interface vulResultDataResponse {
  list: vulResultData[]
  total: number
}
export const getVulResultDataApi = (
  search: string,
  pageIndex: number,
  pageSize: number,
  filter: Record<string, any>
): Promise<IResponse<vulResultDataResponse>> => {
  return request.post({
    url: '/api/assets/vulnerability',
    data: { search, pageIndex, pageSize, filter }
  })
}
