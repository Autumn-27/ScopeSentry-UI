import request from '@/axios'
import { NodeData, nodeRespData, nodeLogRespData } from './types'

interface NodeDataResponse {
  list: NodeData[]
}

interface NodeDataOnlineResponse {
  list: string[]
}

export const getNodeDataApi = (): Promise<IResponse<NodeDataResponse>> => {
  return request.get({ url: '/api/node/data' })
}

export const getNodeDataOnlineApi = (): Promise<IResponse<NodeDataOnlineResponse>> => {
  return request.get({ url: '/api/node/data/online' })
}

export const updateNodeConfigDataApi = (
  oldName: string,
  name: string,
  ModulesConfig: string,
  state: boolean
): Promise<IResponse<NodeDataResponse>> => {
  return request.post({
    url: '/api/node/config/update',
    data: {
      oldName,
      name,
      ModulesConfig,
      state
    }
  })
}

export const deleteNodeApi = (names: string[]): Promise<IResponse<nodeRespData>> => {
  return request.post({ url: '/api/node/delete', data: { names } })
}

export const getNodeLogApi = (name: string): Promise<IResponse<nodeLogRespData>> => {
  return request.post({ url: '/api/node/log/data', data: { name } })
}
