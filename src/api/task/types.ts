export type TaskData = {
  ID: string
  name: string
  taskNum: string
  progress: string
  creatTime: string
  endTime: string
}

export type taskRespData = {
  code: string
  message: string
}

export type TaskContentData = {
  name: string
  target: string
  node: []
  subdomainScan: boolean
  subdomainConfig: []
  urlScan: boolean
  sensitiveInfoScan: boolean
  pageMonitoring: string
  crawlerScan: boolean
  vulScan: boolean
  vulList: []
  portScan: boolean
  ports: string
  dirScan: boolean
  waybackurl: boolean
}
