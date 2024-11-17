import request from '@/axios'
import type { LogRespData, pluginData } from './types'
import { commonRespData } from '../scommon/types'

interface pluginDataResponse {
  list: pluginData[]
  total: number
}

interface PluginDeleteItem {
  hash: string
  module: string
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
  source: string,
  key: string
): Promise<IResponse<commonRespData>> => {
  return request.post({
    url: '/api/plugin/save',
    data: { id, name, version, module, parameter, help, introduction, source, key }
  })
}

export const deletePluginDataApi = (
  items: PluginDeleteItem[]
): Promise<IResponse<commonRespData>> => {
  return request.post({
    url: '/api/plugin/delete',
    data: { data: items }
  })
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

export const reInstallPluginApi = (
  node: string,
  hash: string,
  module: string
): Promise<IResponse<pluginDataResponse>> => {
  return request.post({ url: '/api/plugin/reinstall', data: { node, hash, module } })
}

export const reCheckPluginApi = (
  node: string,
  hash: string,
  module: string
): Promise<IResponse<pluginDataResponse>> => {
  return request.post({ url: '/api/plugin/recheck', data: { node, hash, module } })
}

export const uninstallPluginApi = (
  node: string,
  hash: string,
  module: string
): Promise<IResponse<pluginDataResponse>> => {
  return request.post({ url: '/api/plugin/uninstall', data: { node, hash, module } })
}
