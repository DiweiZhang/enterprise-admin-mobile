export type BusinessGroup = {
  id: string
  name: string
  description: string
  icon: string
  color: string
  permissions: string[]
  actions: string[]
  badge?: string
}

export const businessGroups: BusinessGroup[] = [
  {
    id: 'production',
    name: '生产执行',
    description: '任务 · 报工 · 过站',
    icon: 'list',
    color: '#2374e1',
    permissions: ['production:view'],
    actions: ['我的任务', '生产报工', '工序过站'],
    badge: '8',
  },
  {
    id: 'quality',
    name: '质量管理',
    description: '检验 · 不良 · 评审',
    icon: 'check-circle',
    color: '#0c9b82',
    permissions: ['quality:view'],
    actions: ['首检巡检', '检验录入', '不合格品'],
    badge: '3',
  },
  {
    id: 'warehouse',
    name: '物料仓储',
    description: '库存 · 领料 · 盘点',
    icon: 'home',
    color: '#7a63d1',
    permissions: ['warehouse:view'],
    actions: ['库存查询', '工单领料', '扫码盘点'],
  },
  {
    id: 'equipment',
    name: '设备工装',
    description: '点检 · 维修 · 工装',
    icon: 'setting1',
    color: '#ea8b2d',
    permissions: ['equipment:view'],
    actions: ['设备台账', '故障报修', '点检保养'],
    badge: '1',
  },
  {
    id: 'traceability',
    name: '批次追溯',
    description: '批次 · SN · 履历',
    icon: 'scan',
    color: '#0e91b4',
    permissions: ['traceability:view'],
    actions: ['扫码追溯', '生产履历', '关键件绑定'],
  },
  {
    id: 'planning',
    name: '计划工单',
    description: '排程 · 派工 · 齐套',
    icon: 'calendar',
    color: '#3f70be',
    permissions: ['planning:view'],
    actions: ['排程查看', '工单派工', '齐套检查'],
  },
  {
    id: 'andon',
    name: '异常安灯',
    description: '呼叫 · 响应 · 闭环',
    icon: 'warning',
    color: '#de5960',
    permissions: ['andon:view'],
    actions: ['一键呼叫', '异常处理', '超时升级'],
    badge: '2',
  },
  {
    id: 'collaboration',
    name: '工厂协同',
    description: '班组 · 排班 · 技能',
    icon: 'usergroup',
    color: '#428caa',
    permissions: ['collaboration:view'],
    actions: ['我的班组', '班次日历', '技能矩阵'],
  },
  {
    id: 'delivery',
    name: '订单交付',
    description: '订单 · 评审 · 发货',
    icon: 'cart',
    color: '#897040',
    permissions: ['delivery:view'],
    actions: ['订单查询', '订单评审', '交付进度'],
  },
  {
    id: 'master-data',
    name: '基础查询',
    description: '物料 · BOM · 工艺',
    icon: 'search',
    color: '#687d91',
    permissions: ['master-data:view'],
    actions: ['物料查询', 'BOM 查询', '工艺路线'],
  },
]

export const operatorPermissions = [
  'production:view',
  'quality:view',
  'warehouse:view',
  'equipment:view',
  'traceability:view',
  'collaboration:view',
  'andon:view',
  'master-data:view',
]
