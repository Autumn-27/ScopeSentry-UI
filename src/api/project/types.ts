export type ProjectData = {
  id: string
  name: string
  logo: string
  AssetCount: number
  tag: string
}

export type projectRespData = {
  code: string
  message: string
}

export type projectContent = {
  name: string
  tag: string
  target: string
  logo: string
  scheduledTasks: boolean
  subdomainScan: boolean
  subdomainConfig: []
  urlScan: boolean
  sensitiveInfoScan: boolean
  pageMonitoring: string
  crawlerScan: boolean
  vulScan: boolean
  vulList: []
  day: number
  hour: number
  minute: number
  portScan: boolean
  ports: string
  dirScan: boolean
  allNode: boolean
  node: string[]
  duplicates: string
}
