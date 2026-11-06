import { storageKeys } from './storage'

let accessToken = ''

export function getAccessToken(): string {
  return accessToken || String(uni.getStorageSync(storageKeys.token) || '')
}

export function setAccessToken(token: string): void {
  accessToken = token
  if (token) {
    uni.setStorageSync(storageKeys.token, token)
  } else {
    uni.removeStorageSync(storageKeys.token)
  }
}

export function clearSession(): void {
  setAccessToken('')
}
