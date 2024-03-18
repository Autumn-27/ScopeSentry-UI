export type NodeData = {
  name: string
  running: number
  finished: number
  state: number
  cpuNum: number
  memNum: number
  updateTime: string
  maxTaskNum: string
}

export type nodeRespData = {
  code: string
  message: string
}

export type nodeLogRespData = {
  code: string
  logs: string
}
