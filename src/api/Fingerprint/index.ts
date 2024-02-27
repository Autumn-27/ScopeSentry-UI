import request from '@/axios'
import type { fingerprintData, fingerprintRespData } from './types'

interface fingerprintDataResponse {
  list: fingerprintData[]
  total: number
}
export const getFingerprintDataApi = (
  search: string,
  pageIndex: number,
  pageSize: number
): Promise<IResponse<fingerprintDataResponse>> => {
  return request.post({ url: '/api/fingerprint/data', data: { search, pageIndex, pageSize } })
}

export const addFingerprintDataApi = (
  name: string,
  rule: string,
  category: string,
  parent_category: string,
  state: boolean
): Promise<IResponse<fingerprintRespData>> => {
  return request.post({
    url: '/api/fingerprint/add',
    data: { name, rule, category, parent_category, state }
  })
}

export const updateFingerprintDataApi = (
  id: string,
  name: string,
  rule: string,
  category: string,
  parent_category: string,
  state: boolean
): Promise<IResponse<fingerprintRespData>> => {
  return request.post({
    url: '/api/fingerprint/update',
    data: { id, name, rule, category, parent_category, state }
  })
}

export const deleteFingerprintDataApi = (
  ids: string[]
): Promise<IResponse<fingerprintRespData>> => {
  return request.post({ url: '/api/fingerprint/delete', data: { ids } })
}
