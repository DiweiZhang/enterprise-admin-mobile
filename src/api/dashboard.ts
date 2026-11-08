import { appConfig } from '@/config'
import type { DashboardData } from '@/types/api'
import { get } from '@/utils/request'

const mockDashboard: DashboardData = {
  date: new Date().toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
  metrics: [
    { label: '当日产量', value: '1,286', trend: '较昨日 +8.2%', tone: 'primary' },
    { label: '一次合格率', value: '98.6%', trend: '目标 ≥ 98%', tone: 'success' },
    { label: '设备综合效率', value: '87.4%', trend: '较昨日 +1.6%', tone: 'success' },
    { label: '待处理异常', value: '3', trend: '1 项高优先级', tone: 'warning' },
  ],
  dailyOutput: [
    { date: '周一', output: 980, target: 1100 },
    { date: '周二', output: 1120, target: 1100 },
    { date: '周三', output: 1060, target: 1100 },
    { date: '周四', output: 1210, target: 1150 },
    { date: '周五', output: 1180, target: 1150 },
    { date: '周六', output: 1286, target: 1200 },
    { date: '周日', output: 1250, target: 1200 },
  ],
  quality: [
    { name: '合格', value: 1268 },
    { name: '返工', value: 12 },
    { name: '报废', value: 6 },
  ],
  pendingTasks: [
    { id: 'WO-20261106-001', title: '一号产线 · 首件检验待复核', priority: '高' },
    { id: 'WO-20261106-008', title: '二号产线 · 设备点检待提交', priority: '中' },
    { id: 'WO-20261105-016', title: '装配车间 · 报工记录待审核', priority: '低' },
  ],
}

export function getDashboard(): Promise<DashboardData> {
  if (appConfig.useMock) {
    return new Promise((resolve) => setTimeout(() => resolve(mockDashboard), 350))
  }
  return get<DashboardData>('/dashboard/production')
}
