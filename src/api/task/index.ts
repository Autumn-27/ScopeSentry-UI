import request from '@/axios'
import type { TaskData, taskRespData } from './types'

interface TaskDataResponse {
  list: TaskData[]
  total: number
}
export const getTaskDataApi = (
  search: string,
  pageIndex: number,
  pageSize: number
): Promise<IResponse<TaskDataResponse>> => {
  return request.post({ url: '/api/task/data', data: { search, pageIndex, pageSize } })
}

export const addTaskApi = (
  name: string,
  target: string,
  node: string[],
  allNode: boolean,
  subdomainScan: boolean,
  subdomainConfig: string[],
  urlScan: boolean,
  sensitiveInfoScan: boolean,
  pageMonitoring: string,
  crawlerScan: boolean,
  vulScan: boolean,
  vulList: string[]
): Promise<IResponse<taskRespData>> => {
  return request.post({
    url: '/api/task/add',
    data: {
      name,
      target,
      node,
      allNode,
      subdomainScan,
      subdomainConfig,
      urlScan,
      sensitiveInfoScan,
      pageMonitoring,
      crawlerScan,
      vulScan,
      vulList
    }
  })
}
