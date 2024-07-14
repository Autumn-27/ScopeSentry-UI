import request from '@/axios'
import { ProjectData, projectRespData, projectContent } from './types'
import { commonRespData } from '../scommon/types'

interface projectDataResponse {
  result: { [key: string]: ProjectData[] }
  tag: { [key: string]: number }
}

export const getProjectDataApi = (
  search: string,
  pageIndex: number,
  pageSize: number
): Promise<IResponse<projectDataResponse>> => {
  return request.post({ url: '/api/project/data', data: { search, pageIndex, pageSize } })
}

export const getProjectAllApi = async () => {
  return request.get({ url: '/api/project/all' })
}

export const addProjectDataApi = (
  runNow: boolean,
  name: string,
  tag: string,
  target: string,
  logo: string,
  scheduledTasks: boolean,
  subdomainScan: boolean,
  subdomainConfig: any[],
  urlScan: boolean,
  sensitiveInfoScan: boolean,
  pageMonitoring: string,
  crawlerScan: boolean,
  vulScan: boolean,
  vulList: any[],
  hour: number,
  portScan: boolean,
  ports: string,
  dirScan: boolean,
  allNode: boolean,
  node: string[],
  waybackurl: boolean,
  duplicates: string
): Promise<IResponse<projectRespData>> => {
  return request.post({
    url: '/api/project/add',
    data: {
      runNow,
      name,
      tag,
      target,
      logo,
      scheduledTasks,
      subdomainScan,
      subdomainConfig,
      urlScan,
      sensitiveInfoScan,
      pageMonitoring,
      crawlerScan,
      vulScan,
      vulList,
      hour,
      portScan,
      ports,
      dirScan,
      allNode,
      node,
      waybackurl,
      duplicates
    }
  })
}
export const updateProjectDataApi = (
  runNow: boolean,
  id: string,
  name: string,
  tag: string,
  target: string,
  logo: string,
  scheduledTasks: boolean,
  subdomainScan: boolean,
  subdomainConfig: any[],
  urlScan: boolean,
  sensitiveInfoScan: boolean,
  pageMonitoring: string,
  crawlerScan: boolean,
  vulScan: boolean,
  vulList: any[],
  hour: number,
  portScan: boolean,
  ports: string,
  dirScan: boolean,
  allNode: boolean,
  node: string[],
  waybackurl: boolean,
  duplicates: string
): Promise<IResponse<projectRespData>> => {
  return request.post({
    url: '/api/project/update',
    data: {
      runNow,
      id,
      name,
      tag,
      target,
      logo,
      scheduledTasks,
      subdomainScan,
      subdomainConfig,
      urlScan,
      sensitiveInfoScan,
      pageMonitoring,
      crawlerScan,
      vulScan,
      vulList,
      hour,
      portScan,
      ports,
      dirScan,
      allNode,
      node,
      waybackurl,
      duplicates
    }
  })
}
export const getProjectContentDataApi = (id: string): Promise<IResponse<projectContent>> => {
  return request.post({ url: '/api/project/content', data: { id } })
}

export const deleteProjectApi = (
  ids: string[],
  delA: boolean
): Promise<IResponse<commonRespData>> => {
  return request.post({ url: '/api/project/delete', data: { ids, delA } })
}
