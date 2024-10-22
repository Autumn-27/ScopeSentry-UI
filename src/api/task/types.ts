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
  scheduledTasks: boolean
  hour: number
  allNode: boolean
  duplicates: string
}

export type TaskProgessInfo = {
  subdomain: string[]
  subdomainTakeover: string[]
  portScan: string[]
  assetMapping: string[]
  urlScan: string[]
  crawler: string[]
  dirScan: string[]
  vulnerability: string[]
  all: string[]
}

export type ScheduledTaskData = {
  ID: string
  name: string
  taskType: string
  lastTime: string
  nextTime: string
  state: string
}

export type ScanTemplateData = {
  ID: string
  name: string
  taskNum: string
  progress: string
  creatTime: string
  endTime: string
}
