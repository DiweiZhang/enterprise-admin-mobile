import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { UserProfile } from '@/types/api'
import { appConfig } from '@/config'
import { loginRequest } from '@/api/auth'
import { businessGroups, operatorPermissions } from '@/data/navigation'
import { clearSession, getAccessToken, setAccessToken } from '@/utils/session'
import { storageKeys } from '@/utils/storage'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const profile = ref<UserProfile | null>(null)
  const isLoggedIn = computed(() => Boolean(token.value))
  const factoryName = computed(() => profile.value?.factoryName || '华东智能制造工厂')
  const permissions = computed(
    () =>
      profile.value?.permissions ||
      (isLoggedIn.value ? businessGroups.map((group) => group.permissions[0]) : []),
  )

  function restoreSession() {
    token.value = getAccessToken()
    const storedProfile = uni.getStorageSync(storageKeys.profile)
    if (storedProfile) {
      try {
        profile.value = JSON.parse(storedProfile) as UserProfile
      } catch {
        uni.removeStorageSync(storageKeys.profile)
      }
    }
  }

  async function login(username: string, password: string) {
    if (appConfig.useMock) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      if (password !== 'mes2026') throw new Error('演示账号密码为 mes2026')
      const isOperator = username === 'line-operator'
      token.value = 'demo-token'
      profile.value = {
        id: username,
        name: isOperator ? '陈晓峰' : '林致远',
        roles: [isOperator ? 'line-operator' : 'factory-manager'],
        factoryName: '华东智能制造工厂',
        department: isOperator ? '精密加工一部' : '制造运营中心',
        team: isOperator ? 'A 班 · CNC 一组' : '生产管理部',
        permissions: isOperator
          ? operatorPermissions
          : businessGroups.map((group) => group.permissions[0]),
      }
    } else {
      const result = await loginRequest(username, password)
      token.value = result.token
      profile.value = result.user
    }

    setAccessToken(token.value)
    uni.setStorageSync(storageKeys.profile, JSON.stringify(profile.value))
  }

  function logout() {
    token.value = ''
    profile.value = null
    uni.removeStorageSync(storageKeys.profile)
    clearSession()
  }

  return { token, profile, isLoggedIn, factoryName, permissions, restoreSession, login, logout }
})
