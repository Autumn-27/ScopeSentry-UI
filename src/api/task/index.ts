import request from '@/axios'
import type {
  TaskData,
  taskRespData,
  TaskDetail,
  TaskProgessInfo,
  ScheduledTaskData,
  TemplateData,
  TemplateDetail
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

export const stopTaskApi = (id: string): Promise<IResponse<TaskDataResponse>> => {
  return request.post({ url: '/api/task/stop', data: { id } })
}

export const starTaskApi = (id: string): Promise<IResponse<TaskDataResponse>> => {
  return request.post({ url: '/api/task/start', data: { id } })
}

export const addTaskApi = (
  name: string,
  target: string,
  ignore: string,
  node: string[],
  allNode: boolean,
  duplicates: string,
  scheduledTasks: boolean,
  hour: number,
  template: string
): Promise<IResponse<taskRespData>> => {
  return request.post({
    url: '/api/task/add',
    data: {
      name,
      target,
      ignore,
      node,
      allNode,
      duplicates,
      scheduledTasks,
      hour,
      template
    }
  })
}
export const updateScheduleApi = (
  id: string,
  name: string,
  target: string,
  ignore: string,
  node: string[],
  allNode: boolean,
  duplicates: string,
  scheduledTasks: boolean,
  hour: number,
  template: string
): Promise<IResponse<taskRespData>> => {
  return request.post({
    url: '/api/task/scheduled/update',
    data: {
      id,
      name,
      target,
      ignore,
      node,
      allNode,
      duplicates,
      scheduledTasks,
      hour,
      template
    }
  })
}

export const getTaskDetailApi = (id: string): Promise<IResponse<TaskDetail>> => {
  return request.post({ url: '/api/task/detail', data: { id } })
}

export const getScheduleDetailApi = (id: string): Promise<IResponse<TaskDetail>> => {
  return request.post({ url: '/api/task/scheduled/detail', data: { id } })
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
  pageIndex: number,
  pageSize: number
): Promise<IResponse<TaskProgessInforesp>> => {
  return request.post({ url: '/api/task/progress/info', data: { id, pageIndex, pageSize } })
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
  return request.post({ url: '/api/task/scheduled/data', data: { search, pageIndex, pageSize } })
}

export const taskRunApi = (id: string): Promise<IResponse<commonRespData>> => {
  return request.post({ url: '/api/task/scheduled/run', data: { id } })
}

export const scheduledDeleteTaskApi = (ids: string[]): Promise<IResponse<commonRespData>> => {
  return request.post({ url: '/api/task/scheduled/delete', data: { ids } })
}

export const getScheduledTaskPageMonitDataApi = (
  search: string,
  pageIndex: number,
  pageSize: number
): Promise<IResponse<ScheduledTaskDataResponse>> => {
  return request.post({
    url: '/api/task/scheduled/pagemonit/data',
    data: { search, pageIndex, pageSize }
  })
}

export const deleteScheduledTaskPageMonitApi = (
  ids: string[]
): Promise<IResponse<commonRespData>> => {
  return request.post({ url: '/api/task/scheduled/pagemonit/delete', data: { ids } })
}

export const updateScheduledTaskPageMonitApi = (
  hour: number,
  node: string[],
  allNode: boolean,
  state: boolean
): Promise<IResponse<taskRespData>> => {
  return request.post({
    url: '/api/task/scheduled/pagemonit/update',
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
    url: '/api/task/scheduled/pagemonit/add',
    data: {
      url
    }
  })
}

interface TaskDataResponse {
  list: TaskData[]
  total: number
}
export const getTemplateDataApi = (
  search: string,
  pageIndex: number,
  pageSize: number
): Promise<IResponse<TaskDataResponse>> => {
  return request.post({ url: '/api/task/template/list', data: { search, pageIndex, pageSize } })
}

export const getTemplateDetailApi = (id: string): Promise<IResponse<TemplateDetail>> => {
  return request.post({ url: '/api/task/template/detail', data: { id } })
}

export const saveTemplateDetailApi = (
  result: Record<string, any>,
  id: string
): Promise<IResponse<TemplateDetail>> => {
  return request.post({ url: '/api/task/template/save', data: { result, id } })
}

export const deleteTemplateDetailApi = (ids: string[]): Promise<IResponse<commonRespData>> => {
  return request.post({ url: '/api/task/template/delete', data: { ids } })
}
