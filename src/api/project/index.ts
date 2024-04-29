import request from '@/axios'
import { ProjectData, projectRespData, projectContent } from './types'
import { commonRespData } from '../common/types'

export const getProjectDataApi = (): Promise<IResponse<ProjectData[]>> => {
  return request.get({ url: '/api/project/data' })
}

export const addProjectDataApi = (
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
  node: string[]
): Promise<IResponse<projectRespData>> => {
  return request.post({
    url: '/api/project/add',
    data: {
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
      node
    }
  })
}

export const getProjectContentDataApi = (id: string): Promise<IResponse<projectContent>> => {
  return request.post({ url: '/api/project/content', data: { id } })
}

export const deleteProjectApi = (id: string): Promise<IResponse<commonRespData>> => {
  return request.post({ url: '/api/project/delete', data: { id } })
}
