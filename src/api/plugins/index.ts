import request from '@/axios'
import type { pluginData } from './types'

interface pluginDataResponse {
  list: pluginData[]
  total: number
}
export const getPluginDataApi = (
  search: string,
  pageIndex: number,
  pageSize: number
): Promise<IResponse<pluginDataResponse>> => {
  return request.post({ url: '/api/plugin/list', data: { search, pageIndex, pageSize } })
}

export const getPluginDetailApi = (id: string): Promise<IResponse<pluginData>> => {
  return request.post({ url: '/api/plugin/detail', data: { id } })
}
