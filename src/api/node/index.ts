import request from '@/axios'
import { NodeData, nodeRespData } from './types'

interface NodeDataResponse {
  list: NodeData[]
}

export const getNodeDataApi = (): Promise<IResponse<NodeDataResponse>> => {
  return request.get({ url: '/api/node/data' })
}

export const updateNodeConfigDataApi = (
  name: string,
  maxTaskNum: string,
  state: boolean
): Promise<IResponse<NodeDataResponse>> => {
  return request.post({ url: '/api/node/config/update', data: { name, maxTaskNum, state } })
}

export const deleteNodeApi = (names: string[]): Promise<IResponse<nodeRespData>> => {
  return request.post({ url: '/api/node/delete', data: { names } })
}
