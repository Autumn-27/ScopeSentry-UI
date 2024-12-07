import request from '@/axios'
import type { pocData, pocRespData, pocContent, pocNameList } from './types'

interface pocDataResponse {
  list: pocData[]
  total: number
}
export const getPocDataApi = (
  search: string,
  pageIndex: number,
  pageSize: number,
  filter: Record<string, any>
): Promise<IResponse<pocDataResponse>> => {
  return request.post({ url: '/api/poc/data', data: { search, pageIndex, pageSize, filter } })
}

// 定义树形结构的数据类型
interface TreeNode {
  value: string
  label: string
  children: TreeNode[]
}

// 修改 getPocDataAllApi 的返回类型定义
interface PocDataResponse {
  data: TreeNode[]
}

export const getPocDataAllApi = (): Promise<IResponse<PocDataResponse>> => {
  return request.get({ url: '/api/poc/data/all' })
}
export const getPocNameListApi = (): Promise<IResponse<pocDataResponse>> => {
  return request.get({ url: '/api/poc/name/list' })
}

export const getPocContentApi = (id: string): Promise<IResponse<pocContent>> => {
  return request.post({ url: '/api/poc/content', data: { id } })
}

export const addPocDataApi = (
  name: string,
  content: string,
  level: string,
  tags: string[]
): Promise<IResponse<pocRespData>> => {
  return request.post({ url: '/api/poc/add', data: { name, content, level, tags } })
}

export const updatePocDataApi = (
  id: string,
  name: string,
  content: string,
  level: string,
  tags: string[]
): Promise<IResponse<pocRespData>> => {
  return request.post({ url: '/api/poc/update', data: { id, name, content, level, tags } })
}

export const deletePocDataApi = (ids: string[]): Promise<IResponse<pocRespData>> => {
  return request.post({ url: '/api/poc/delete', data: { ids } })
}
