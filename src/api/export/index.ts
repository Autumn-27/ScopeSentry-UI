import request from '@/axios'
import { commonRespData } from '../scommon/types'

export const exportApi = (
  index: string,
  quantity: number,
  type: string,
  search: string,
  filter: Record<string, any>
): Promise<IResponse<commonRespData>> => {
  return request.post({ url: '/api/export', data: { index, quantity, type, search, filter } })
}

export const getExportRecordApi = () => {
  return request.get({ url: '/api/export/record' })
}

export const delExportApi = (ids: string[]): Promise<IResponse<commonRespData>> => {
  return request.post({ url: '/api/export/delete', data: { ids } })
}

export const downloadExportApi = (id: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    request
      .post({
        url: '/api/export/download',
        data: { id },
        responseType: 'blob'
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

type FieldRespData = {
  field: string[]
}

export const getFieldApi = (index: string): Promise<IResponse<FieldRespData>> => {
  return request.post({ url: '/api/getfield', data: { index } })
}
