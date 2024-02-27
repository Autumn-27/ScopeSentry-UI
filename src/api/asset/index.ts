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
  PageMonitoringData
} from './types'

interface AssetDataResponse {
  list: AssetData[]
  total: number
}
export const getAssetApi = (
  search: string,
  pageIndex: number,
  pageSize: number
): Promise<IResponse<AssetDataResponse>> => {
  return request.post({ url: '/api/asset/data', data: { search, pageIndex, pageSize } })
}

export const getAssetStatisticsApi = (search: string): Promise<IResponse<AssetStatistics>> => {
  return request.post({ url: '/api/asset/statistics', data: { search } })
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
  pageSize: number
): Promise<IResponse<SubdomainDataResponse>> => {
  return request.post({ url: '/api/subdomain/data', data: { search, pageIndex, pageSize } })
}

interface URLDataResponse {
  list: URLData[]
  total: number
}

export const getURLApi = (
  search: string,
  pageIndex: number,
  pageSize: number
): Promise<IResponse<URLDataResponse>> => {
  return request.post({ url: '/api/url/data', data: { search, pageIndex, pageSize } })
}

interface CrawlerDataResponse {
  list: CrawlerData[]
  total: number
}

export const getCrawlerApi = (
  search: string,
  pageIndex: number,
  pageSize: number
): Promise<IResponse<CrawlerDataResponse>> => {
  return request.post({ url: '/api/crawler/data', data: { search, pageIndex, pageSize } })
}

interface SensitiveDataResponse {
  list: SensitiveData[]
  total: number
}
export const getSensitiveApi = (
  search: string,
  pageIndex: number,
  pageSize: number
): Promise<IResponse<SensitiveDataResponse>> => {
  return request.post({ url: '/api/sensitive/data', data: { search, pageIndex, pageSize } })
}

interface DirScanDataResponse {
  list: DirScanData[]
  total: number
}
export const getDirScanApi = (
  search: string,
  pageIndex: number,
  pageSize: number
): Promise<IResponse<DirScanDataResponse>> => {
  return request.post({ url: '/api/dirscan/data', data: { search, pageIndex, pageSize } })
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
  return request.post({ url: '/api/pagemonitoring/data', data: { search, pageIndex, pageSize } })
}
