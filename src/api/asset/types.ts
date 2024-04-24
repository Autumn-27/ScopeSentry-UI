export type AssetData = {
  id: string
  domain: string
  ip: string
  port: number
  service: string
  title: string
  status: number
  banner: string
  products: string[]
  time: String
  icon: string
}

export type AssetStatistics = {
  Port: { value: number; number: number }[]
  Service: { value: string; number: number }[]
  Product: { value: string; number: number }[]
  Icon: { value: string; number: number; icon_hash: string }[]
}

export type AssetDetail = {
  ID: string
  Domain: string
  IP: string
  URL: string
  Port: number
  Title: string
  Status: number
  FaviconHash: string
  Jarm: string
  Time: String
  Products: string[]
  Service: string
  TLSData: string
  Hash: string
  ResponseHeaders: string
  ResponseBody: string
}

export type SubdomainData = {
  id: string
  host: string
  type: string
  value: string[]
  ip: string[]
  time: string
}

export type URLData = {
  ID: string
  URL: string
  Source: string
  Type: string
  Input: string
  Time: string
}

export type CrawlerData = {
  ID: string
  Method: string
  URL: string
  GetParameter: string
  PostParameter: string
  Time: string
}

export type SensitiveData = {
  ID: string
  url: string
  color: string
  name: String
  time: string
  body: string
  match: string[]
}

export type DirScanData = {
  ID: string
  URL: string
  Title: string
  Status: String
  Length: string
  Time: string
}

export type PageMonitoringData = {
  ID: string
  URL: string
  OldResponseBodyMD5: string
  CurrentResponseBodyMD5: String
  Time: string
}
