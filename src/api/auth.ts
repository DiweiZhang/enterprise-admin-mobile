import type { UserProfile } from '@/types/api'
import { post } from '@/utils/request'

/** 登录结果；后端 envelope 由统一请求层解包。 */
export interface LoginResult {
  token: string
  user: UserProfile
}

export function loginRequest(username: string, password: string): Promise<LoginResult> {
  return post<LoginResult>(
    '/auth/login',
    { username, password },
    { skipAuth: true, skipUnauthorizedHandler: true },
  )
}
