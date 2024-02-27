import request from '@/axios'
import type { dictRespData, portDictData } from './types'
export const getSubdomainDictionaryApi = () => {
  return request.get({ url: '/api/dictionary/subdomain/data' })
}

export const saveSubdomainDictionaryApi = (dict: string): Promise<IResponse<dictRespData>> => {
  return request.post({ url: '/api/dictionary/subdomain/save', data: { dict } })
}

export const getDirDictionaryApi = () => {
  return request.get({ url: '/api/dictionary/dir/data' })
}

export const saveDirDictionaryApi = (dict: string): Promise<IResponse<dictRespData>> => {
  return request.post({ url: '/api/dictionary/dir/save', data: { dict } })
}

interface portDictDataResponse {
  list: portDictData[]
  total: number
}
export const getPortDictDataApi = (
  search: string,
  pageIndex: number,
  pageSize: number
): Promise<IResponse<portDictDataResponse>> => {
  return request.post({ url: '/api/dictionary/port/data', data: { search, pageIndex, pageSize } })
}

export const deletePortDictDataApi = (ids: string[]): Promise<IResponse<dictRespData>> => {
  return request.post({ url: '/api/dictionary/port/delete', data: { ids } })
}

export const upgradePortDictDataApi = (
  id: string,
  name: string,
  value: string
): Promise<IResponse<dictRespData>> => {
  return request.post({ url: '/api/dictionary/port/upgrade', data: { id, name, value } })
}
export const addPortDictDataApi = (
  name: string,
  value: String
): Promise<IResponse<dictRespData>> => {
  return request.post({ url: '/api/dictionary/port/add', data: { name, value } })
}
