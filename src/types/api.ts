export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  requestId?: string
}

export interface UserProfile {
  id: string
  name: string
  roles: string[]
  factoryName: string
}

export interface ProductionMetric {
  label: string
  value: string
  trend: string
  tone: 'primary' | 'success' | 'warning'
}

export interface DashboardData {
  date: string
  metrics: ProductionMetric[]
  dailyOutput: Array<{ date: string; output: number; target: number }>
  quality: Array<{ name: string; value: number }>
  pendingTasks: Array<{ id: string; title: string; priority: '高' | '中' | '低' }>
}
