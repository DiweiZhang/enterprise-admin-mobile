import type { StorageLike } from 'pinia-plugin-persistedstate'

export const uniStorage: StorageLike = {
  getItem(key: string): string | null {
    return uni.getStorageSync(key) || null
  },
  setItem(key: string, value: string): void {
    uni.setStorageSync(key, value)
  },
}

export const storageKeys = {
  token: 'mes_access_token',
  profile: 'mes_user_profile',
  settings: 'mes_settings',
} as const
