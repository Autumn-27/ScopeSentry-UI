export type DashboardTotalTypes = {
  totalAssets: number
  totalSubdomain: number
  totalInformationLeakage: number
  totalURL: number
}

export type UserAccessSource = {
  value: number
  name: string
}

export type WeeklyUserActivity = {
  value: number
  name: string
}

export type MonthlySales = {
  name: string
  estimate: number
  actual: number
}
