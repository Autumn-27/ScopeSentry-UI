import request from '@/axios'
import { commonRespData } from '../scommon/types'

export const exportApi = (
  index: string,
  quantity: number,
  type: string,
  search: string
): Promise<IResponse<commonRespData>> => {
  return request.post({ url: '/api/export', data: { index, quantity, type, search } })
}
