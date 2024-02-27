import request from '@/axios'
import { NodeData } from './types'

interface NodeDataResponse {
  list: NodeData[]
}
export const getNodeDataApi = (): Promise<IResponse<NodeDataResponse>> => {
  return request.get({ url: '/api/node/data' })
}
