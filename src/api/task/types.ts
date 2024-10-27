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

export type TemplateData = {
  ID: string
  name: string
}

export type TemplateDetail = {
  id: string
  name: string
  TargetHandler: string[]
  Parameters: {
    TargetHandler: Record<string, string>
    SubdomainScan: Record<string, string>
    SubdomainSecurity: Record<string, string>
    PortScanPreparation: Record<string, string>
    PortScan: Record<string, string>
    PortFingerprint: Record<string, string>
    AssetMapping: Record<string, string>
    AssetHandle: Record<string, string>
    URLScan: Record<string, string>
    WebCrawler: Record<string, string>
    URLSecurity: Record<string, string>
    DirScan: Record<string, string>
    VulnerabilityScan: Record<string, string>
  }
  SubdomainScan: string[]
  SubdomainSecurity: string[]
  PortScanPreparation: string[]
  PortScan: string[]
  PortFingerprint: string[]
  AssetMapping: string[]
  AssetHandle: string[]
  URLScan: string[]
  WebCrawler: string[]
  URLSecurity: string[]
  DirScan: string[]
  VulnerabilityScan: string[]
  vullist: string[]
}
