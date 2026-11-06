import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { UserProfile } from '@/types/api'
import { appConfig } from '@/config'
import { loginRequest } from '@/api/auth'
import { clearSession, getAccessToken, setAccessToken } from '@/utils/session'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const profile = ref<UserProfile | null>(null)
  const isLoggedIn = computed(() => Boolean(token.value))

  function restoreSession() {
    token.value = getAccessToken()
  }

  async function login(username: string, password: string) {
    if (appConfig.useMock) {
      token.value = 'demo-token'
      profile.value = {
        id: 'demo-user',
        name: username || '演示用户',
        roles: ['factory-manager'],
        factoryName: '华东智能制造工厂',
      }
    } else {
      const result = await loginRequest(username, password)
      token.value = result.token
      profile.value = result.user
    }

    setAccessToken(token.value)
  }

  function logout() {
    token.value = ''
    profile.value = null
    clearSession()
  }

  return { token, profile, isLoggedIn, restoreSession, login, logout }
})
