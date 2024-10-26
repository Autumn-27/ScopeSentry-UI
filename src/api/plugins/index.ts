import request from '@/axios'
import type { LogRespData, pluginData } from './types'
import { commonRespData } from '../scommon/types'

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

export const savePluginDataApi = (
  id: string,
  name: string,
  version: string,
  module: string,
  parameter: string,
  help: string,
  introduction: string,
  source: string
): Promise<IResponse<commonRespData>> => {
  return request.post({
    url: '/api/plugin/save',
    data: { id, name, version, module, parameter, help, introduction, source }
  })
}

export const deletePluginDataApi = (ids: string[]): Promise<IResponse<commonRespData>> => {
  return request.post({ url: '/api/plugin/delete', data: { ids } })
}

export const getPluginLogApi = (module: string, hash: string): Promise<IResponse<LogRespData>> => {
  return request.post({ url: '/api/plugin/log', data: { module, hash } })
}

export const cleanPluginLogApi = (
  module: string,
  hash: string
): Promise<IResponse<LogRespData>> => {
  return request.post({ url: '/api/plugin/log/clean', data: { module, hash } })
}

export const getPluginDataByModuleApi = (
  module: string
): Promise<IResponse<pluginDataResponse>> => {
  return request.post({ url: '/api/plugin/list/bymodule', data: { module } })
}
