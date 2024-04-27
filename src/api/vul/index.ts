import request from '@/axios'
import type { vulResultData } from './types'

interface vulResultDataResponse {
  list: vulResultData[]
  total: number
}
export const getVulResultDataApi = (
  search: string,
  pageIndex: number,
  pageSize: number
): Promise<IResponse<vulResultDataResponse>> => {
  return request.post({ url: '/api/vul/data', data: { search, pageIndex, pageSize } })
}
