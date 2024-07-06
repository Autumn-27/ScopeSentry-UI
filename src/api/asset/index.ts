import request from '@/axios'
import {
  AssetData,
  AssetStatistics,
  AssetDetail,
  SubdomainData,
  URLData,
  CrawlerData,
  SensitiveData,
  DirScanData,
  PageMonitoringData,
  SubdomaintakerData,
  SensitiveBody,
  PageMResponse,
  PageMHistory
} from './types'
import { commonRespData } from '../scommon/types'

interface AssetDataResponse {
  list: AssetData[]
  total: number
}
export const getAssetApi = (
  search: string,
  pageIndex: number,
  pageSize: number,
  filter: Record<string, any>
): Promise<IResponse<AssetDataResponse>> => {
  return request.post({ url: '/api/asset/data', data: { search, pageIndex, pageSize, filter } })
}

export const getAssetStatisticsApi = (search: string): Promise<IResponse<AssetStatistics>> => {
  return request.post({ url: '/api/asset/statistics2', data: { search } })
}

export const getAssetStatisticsPortApi = (
  search: string,
  filter: Record<string, any>
): Promise<IResponse<AssetStatistics>> => {
  return request.post({ url: '/api/asset/statistics/port', data: { search, filter } })
}

export const getAssetStatisticsTypeApi = (
  search: string,
  filter: Record<string, any>
): Promise<IResponse<AssetStatistics>> => {
  return request.post({ url: '/api/asset/statistics/type', data: { search, filter } })
}

export const getAssetStatisticsiconApi = (
  search: string,
  filter: Record<string, any>
): Promise<IResponse<AssetStatistics>> => {
  return request.post({ url: '/api/asset/statistics/icon', data: { search, filter } })
}

export const getAssetStatisticsappApi = (
  search: string,
  filter: Record<string, any>
): Promise<IResponse<AssetStatistics>> => {
  return request.post({ url: '/api/asset/statistics/app', data: { search, filter } })
}

export const getAssetDetailApi = (id: string): Promise<IResponse<AssetDetail>> => {
  return request.post({ url: '/api/asset/detail', data: { id } })
}

interface SubdomainDataResponse {
  list: SubdomainData[]
  total: number
}

export const getSubdomainApi = (
  search: string,
  pageIndex: number,
  pageSize: number,
  filter: Record<string, any>
): Promise<IResponse<SubdomainDataResponse>> => {
  return request.post({ url: '/api/subdomain/data', data: { search, pageIndex, pageSize, filter } })
}

interface URLDataResponse {
  list: URLData[]
  total: number
}

export const getURLApi = (
  search: string,
  pageIndex: number,
  pageSize: number,
  filter: Record<string, any>
): Promise<IResponse<URLDataResponse>> => {
  return request.post({ url: '/api/url/data', data: { search, pageIndex, pageSize, filter } })
}

interface CrawlerDataResponse {
  list: CrawlerData[]
  total: number
}

export const getCrawlerApi = (
  search: string,
  pageIndex: number,
  pageSize: number,
  filter: Record<string, any>
): Promise<IResponse<CrawlerDataResponse>> => {
  return request.post({ url: '/api/crawler/data', data: { search, pageIndex, pageSize, filter } })
}

interface SensitiveDataResponse {
  list: SensitiveData[]
  total: number
}
export const getSensitiveResultApi = (
  search: string,
  pageIndex: number,
  pageSize: number,
  filter: Record<string, any>
): Promise<IResponse<SensitiveDataResponse>> => {
  return request.post({
    url: '/api/sensitive/result/data2',
    data: { search, pageIndex, pageSize, filter }
  })
}

export const getSensitiveResultBodyApi = (id: string): Promise<IResponse<SensitiveBody>> => {
  return request.post({ url: '/api/sensitive/result/body', data: { id } })
}

interface DirScanDataResponse {
  list: DirScanData[]
  total: number
}
export const getDirScanApi = (
  search: string,
  pageIndex: number,
  pageSize: number,
  filter: Record<string, any>,
  sort: Record<string, any>
): Promise<IResponse<DirScanDataResponse>> => {
  return request.post({
    url: '/api/dirscan/result/data',
    data: { search, pageIndex, pageSize, filter, sort }
  })
}

interface PageMonitoringDataResponse {
  list: PageMonitoringData[]
  total: number
}
export const getPageMonitoringApi = (
  search: string,
  pageIndex: number,
  pageSize: number
): Promise<IResponse<PageMonitoringDataResponse>> => {
  return request.post({ url: '/api/page/monitoring/result', data: { search, pageIndex, pageSize } })
}

export const getPageMonitoringResponseApi = (
  id: string,
  flag: string
): Promise<IResponse<PageMResponse>> => {
  return request.post({
    url: '/api/page/monitoring/response',
    data: { id, flag }
  })
}

export const getPageMonitoringHistoryApi = (id: string): Promise<IResponse<PageMHistory>> => {
  return request.post({
    url: '/api/page/monitoring/history/diff',
    data: { id }
  })
}

interface SubdomaintakerDataResponse {
  list: SubdomaintakerData[]
  total: number
}
export const getSubdomaintakerApi = (
  search: string,
  pageIndex: number,
  pageSize: number,
  filter: Record<string, any>
): Promise<IResponse<SubdomaintakerDataResponse>> => {
  return request.post({
    url: '/api/subdomaintaker/data',
    data: { search, pageIndex, pageSize, filter }
  })
}

export const delDataApi = (ids: string[], index: string): Promise<IResponse<commonRespData>> => {
  return request.post({ url: '/api/data/delete', data: { ids, index } })
}
