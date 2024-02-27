import request from '@/axios'
import type { pocData, pocRespData, pocContent } from './types'

interface pocDataResponse {
  list: pocData[]
  total: number
}
export const getPocDataApi = (
  search: string,
  pageIndex: number,
  pageSize: number
): Promise<IResponse<pocDataResponse>> => {
  return request.post({ url: '/api/poc/data', data: { search, pageIndex, pageSize } })
}

export const getPocContentApi = (id: string): Promise<IResponse<pocContent>> => {
  return request.post({ url: '/api/poc/content', data: { id } })
}

export const addPocDataApi = (
  name: string,
  content: string,
  level: string
): Promise<IResponse<pocRespData>> => {
  return request.post({ url: '/api/poc/add', data: { name, content, level } })
}

export const updatePocDataApi = (
  id: string,
  name: string,
  content: string,
  level: string
): Promise<IResponse<pocRespData>> => {
  return request.post({ url: '/api/poc/update', data: { id, name, content, level } })
}

export const deletePocDataApi = (ids: string[]): Promise<IResponse<pocRespData>> => {
  return request.post({ url: '/api/poc/delete', data: { ids } })
}
