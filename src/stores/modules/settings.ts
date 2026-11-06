import { defineStore } from 'pinia'
import { uniStorage } from '@/utils/storage'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    notificationsEnabled: true,
    autoSync: true,
    compactMode: false,
  }),
  persist: {
    key: 'mes_settings',
    storage: uniStorage,
  },
})
