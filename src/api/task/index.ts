import request from '@/axios'
import type {
  TaskData,
  taskRespData,
  TaskContentData,
  TaskProgessInfo,
  ScheduledTaskData
} from './types'
import type { commonRespData } from '../common/types'

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
  duplicates: boolean,
  sensitiveInfoScan: boolean,
  pageMonitoring: string,
  crawlerScan: boolean,
  vulScan: boolean,
  vulList: string[],
  portScan: boolean,
  ports: string,
  dirScan: boolean,
  waybackurl: boolean,
  scheduledTasks: boolean,
  hour: number
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
      duplicates,
      sensitiveInfoScan,
      pageMonitoring,
      crawlerScan,
      vulScan,
      vulList,
      portScan,
      ports,
      dirScan,
      waybackurl,
      scheduledTasks,
      hour
    }
  })
}
export const updateTaskApi = (
  id: string,
  name: string,
  target: string,
  node: string[],
  allNode: boolean,
  subdomainScan: boolean,
  subdomainConfig: string[],
  urlScan: boolean,
  duplicates: boolean,
  sensitiveInfoScan: boolean,
  pageMonitoring: string,
  crawlerScan: boolean,
  vulScan: boolean,
  vulList: string[],
  portScan: boolean,
  ports: string,
  dirScan: boolean,
  waybackurl: boolean,
  scheduledTasks: boolean,
  hour: number
): Promise<IResponse<taskRespData>> => {
  return request.post({
    url: '/api/task/update',
    data: {
      id,
      name,
      target,
      node,
      allNode,
      subdomainScan,
      subdomainConfig,
      urlScan,
      duplicates,
      sensitiveInfoScan,
      pageMonitoring,
      crawlerScan,
      vulScan,
      vulList,
      portScan,
      ports,
      dirScan,
      waybackurl,
      scheduledTasks,
      hour
    }
  })
}

export const getTaskContentApi = (id: string): Promise<IResponse<TaskContentData>> => {
  return request.post({ url: '/api/task/content', data: { id } })
}

export const deleteTaskApi = (ids: string[]): Promise<IResponse<commonRespData>> => {
  return request.post({ url: '/api/task/delete', data: { ids } })
}

export const retestTaskApi = (id: string): Promise<IResponse<commonRespData>> => {
  return request.post({ url: '/api/task/retest', data: { id } })
}

interface TaskProgessInforesp {
  list: TaskProgessInfo[]
  total: number
}
export const getTaskProgressApi = (id: string): Promise<IResponse<TaskProgessInforesp>> => {
  return request.post({ url: '/api/task/progress/info', data: { id } })
}

interface ScheduledTaskDataResponse {
  list: ScheduledTaskData[]
  total: number
}

export const getScheduledTaskDataApi = (
  search: string,
  pageIndex: number,
  pageSize: number
): Promise<IResponse<ScheduledTaskDataResponse>> => {
  return request.post({ url: '/api/scheduled/task/data', data: { search, pageIndex, pageSize } })
}

export const scheduledDeleteTaskApi = (ids: string[]): Promise<IResponse<commonRespData>> => {
  return request.post({ url: '/api/scheduled/task/delete', data: { ids } })
}
