import request from '@/axios'
import type { TaskData } from './types'

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
