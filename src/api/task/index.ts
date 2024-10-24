import request from '@/axios'
import type {
  TaskData,
  taskRespData,
  TaskContentData,
  TaskProgessInfo,
  ScheduledTaskData
} from './types'
import type { commonRespData } from '../scommon/types'

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
  duplicates: string,
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
  duplicates: string,
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

export const deleteTaskApi = (ids: string[], delA: boolean): Promise<IResponse<commonRespData>> => {
  return request.post({ url: '/api/task/delete', data: { ids, delA } })
}

export const retestTaskApi = (id: string): Promise<IResponse<commonRespData>> => {
  return request.post({ url: '/api/task/retest', data: { id } })
}

interface TaskProgessInforesp {
  list: TaskProgessInfo[]
  total: number
}
export const getTaskProgressApi = (
  id: string,
  type: string,
  runner: string
): Promise<IResponse<TaskProgessInforesp>> => {
  return request.post({ url: '/api/task/progress/info', data: { id, type, runner } })
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

export const taskRunApi = (id: string): Promise<IResponse<commonRespData>> => {
  return request.post({ url: '/api/scheduled/task/run', data: { id } })
}

export const scheduledDeleteTaskApi = (ids: string[]): Promise<IResponse<commonRespData>> => {
  return request.post({ url: '/api/scheduled/task/delete', data: { ids } })
}

export const getScheduledTaskPageMonitDataApi = (
  search: string,
  pageIndex: number,
  pageSize: number
): Promise<IResponse<ScheduledTaskDataResponse>> => {
  return request.post({
    url: '/api/scheduled/task/pagemonit/data',
    data: { search, pageIndex, pageSize }
  })
}

export const deleteScheduledTaskPageMonitApi = (
  ids: string[]
): Promise<IResponse<commonRespData>> => {
  return request.post({ url: '/api/scheduled/task/pagemonit/delete', data: { ids } })
}

export const updateScheduledTaskPageMonitApi = (
  hour: number,
  node: string[],
  allNode: boolean,
  state: boolean
): Promise<IResponse<taskRespData>> => {
  return request.post({
    url: '/api/scheduled/task/pagemonit/update',
    data: {
      hour,
      node,
      allNode,
      state
    }
  })
}

export const addScheduledTaskPageMonitApi = (url: string): Promise<IResponse<taskRespData>> => {
  return request.post({
    url: '/api/scheduled/task/pagemonit/add',
    data: {
      url
    }
  })
}
