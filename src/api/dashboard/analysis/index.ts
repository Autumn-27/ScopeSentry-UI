import request from '@/axios'
import type {
  DashboardTotalTypes,
  UserAccessSource,
  WeeklyUserActivity,
  MonthlySales
} from './types'

interface DashboardTotalTypesResponse {
  data: DashboardTotalTypes
}

export const getAssetStatisticsApi = (): Promise<IResponse<DashboardTotalTypesResponse[]>> => {
  return request.get({ url: '/api/asset/statistics/data' })
}

export const getUserAccessSourceApi = (): Promise<IResponse<UserAccessSource[]>> => {
  return request.get({ url: '/mock/analysis/userAccessSource' })
}

export const getWeeklyUserActivityApi = (): Promise<IResponse<WeeklyUserActivity[]>> => {
  return request.get({ url: '/mock/analysis/weeklyUserActivity' })
}

export const getMonthlySalesApi = (): Promise<IResponse<MonthlySales[]>> => {
  return request.get({ url: '/mock/analysis/monthlySales' })
}
