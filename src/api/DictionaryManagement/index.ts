import request from '@/axios'
import type { dictRespData, fileData, portDictData } from './types'
import { commonRespData } from '../scommon/types'
export const getSubdomainDictionaryApi = () => {
  return request.get({ url: '/api/dictionary/subdomain/data' })
}

export const saveSubdomainDictionaryApi = (dict: string): Promise<IResponse<dictRespData>> => {
  return request.post({ url: '/api/dictionary/subdomain/save', data: { dict } })
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

interface fileDataResponse {
  list: fileData[]
}

export const getDirDictListApi = (): Promise<IResponse<fileDataResponse>> => {
  return request.post({ url: '/api/dictionary/dir/list' })
}

export const createDirDictApi = (formData: FormData): Promise<IResponse<commonRespData>> => {
  // 发送 POST 请求
  return request.post({
    url: '/api/dictionary/dir/add',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    } as any
  })
}

export const downloadDirDictApi = (id: string) => {
  return request.get({ url: '/api/dictionary/dir/download?id=' + id })
}

export const deleteDirDictDataApi = (ids: string[]): Promise<IResponse<dictRespData>> => {
  return request.post({ url: '/api/dictionary/dir/delete', data: { ids } })
}

export const getSubdomainDictListApi = (): Promise<IResponse<fileDataResponse>> => {
  return request.post({ url: '/api/dictionary/subdomain/list' })
}

export const createSubdomainDictApi = (formData: FormData): Promise<IResponse<commonRespData>> => {
  // 发送 POST 请求
  return request.post({
    url: '/api/dictionary/subdomain/add',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    } as any
  })
}

export const downloadSubdomainDictApi = (id: string) => {
  return request.get({ url: '/api/dictionary/subdomain/download?id=' + id })
}

export const deleteSubdomainDictDataApi = (ids: string[]): Promise<IResponse<dictRespData>> => {
  return request.post({ url: '/api/dictionary/subdomain/delete', data: { ids } })
}
