import request from '@/axios'
import type { configRespData } from './types'

export const getSubfinderConfigurationApi = () => {
  return request.get({ url: '/api/configuration/subfinder/data' })
}

export const saveSubfinderConfigurationApi = (
  content: string
): Promise<IResponse<configRespData>> => {
  return request.post({ url: '/api/configuration/subfinder/save', data: { content } })
}

export const getRadConfigurationApi = () => {
  return request.get({ url: '/api/configuration/rad/data' })
}

export const saveRadConfigurationApi = (content: string): Promise<IResponse<configRespData>> => {
  return request.post({ url: '/api/configuration/rad/save', data: { content } })
}

export const getSystemConfigurationApi = () => {
  return request.get({ url: '/api/configuration/system/data' })
}

export const saveSystemConfigurationApi = (
  timezone: string
): Promise<IResponse<configRespData>> => {
  return request.post({ url: '/api/configuration/system/save', data: { timezone } })
}
