import request from '@/axios'
import type { configRespData, notificationRespData } from './types'

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
  timezone: string,
  MaxTaskNum: string,
  DirscanThread: string,
  PortscanThread: string
): Promise<IResponse<configRespData>> => {
  return request.post({
    url: '/api/configuration/system/save',
    data: { timezone, MaxTaskNum, DirscanThread, PortscanThread }
  })
}

interface notificationRespInter {
  list: notificationRespData[]
}

export const getNotificationApi = (): Promise<IResponse<notificationRespInter>> => {
  return request.get({ url: '/api/notification/data' })
}

export const addNotificationApi = (
  name: string,
  url: string,
  method: string,
  contentType: string,
  data: string,
  state: boolean
): Promise<IResponse<configRespData>> => {
  return request.post({
    url: '/api/notification/add',
    data: { name, url, method, contentType, data, state }
  })
}

export const updateNotificationApi = (
  id: string,
  name: string,
  url: string,
  method: string,
  contentType: string,
  data: string,
  state: boolean
): Promise<IResponse<configRespData>> => {
  return request.post({
    url: '/api/notification/add',
    data: { id, name, url, method, contentType, data, state }
  })
}

export const deletePocDataApi = (ids: string[]): Promise<IResponse<configRespData>> => {
  return request.post({ url: '/api/notification/delete', data: { ids } })
}

interface notificationConfigRespInter {
  dirScanNotification: boolean
  portScanNotification: boolean
  sensitiveNotification: boolean
  subdomainNotification: boolean
  subdomainTakeoverNotification: boolean
  pageMonNotification: boolean
  vulNotification: boolean
}
export const getNotificationConfigApi = (): Promise<IResponse<notificationConfigRespInter>> => {
  return request.get({ url: '/api/notification/config/data' })
}

export const updateNotificationConfigApi = (
  dirScanNotification: boolean,
  portScanNotification: boolean,
  sensitiveNotification: boolean,
  subdomainNotification: boolean,
  subdomainTakeoverNotification: boolean,
  pageMonNotification: boolean,
  vulNotification: boolean
): Promise<IResponse<configRespData>> => {
  return request.post({
    url: '/api/notification/config/update',
    data: {
      dirScanNotification,
      portScanNotification,
      sensitiveNotification,
      subdomainNotification,
      subdomainTakeoverNotification,
      pageMonNotification,
      vulNotification
    }
  })
}
