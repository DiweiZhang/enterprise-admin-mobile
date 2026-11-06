import { createI18n } from 'vue-i18n'

export const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': {
      app: { name: 'MES 企业移动管理' },
      dashboard: { title: '生产驾驶舱' },
    },
    'en-US': {
      app: { name: 'MES Mobile' },
      dashboard: { title: 'Production Dashboard' },
    },
  },
})
