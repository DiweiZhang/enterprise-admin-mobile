import { appConfig } from '@/config'
import type { ApiResponse } from '@/types/api'
import { BUSINESS_CODE, HTTP_STATUS } from './constants'
import { RequestError } from './error'
import { clearSession, getAccessToken } from './session'

export interface RequestOptions extends Omit<UniApp.RequestOptions, 'success' | 'fail'> {
  skipAuth?: boolean
  /** 是否自动清理失效会话，登录等公开接口应设为 false。 */
  skipUnauthorizedHandler?: boolean
}

function normalizeUrl(url: string): string {
  if (/^https?:\/\//.test(url)) return url
  return `${appConfig.apiBaseURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
}

export function request<T>(options: RequestOptions): Promise<T> {
  const { skipAuth = false, skipUnauthorizedHandler = false, ...requestOptions } = options
  const token = skipAuth ? '' : getAccessToken()
  const header = {
    ...requestOptions.header,
    ...(token && !skipAuth ? { Authorization: `Bearer ${token}` } : {}),
  }

  return new Promise<T>((resolve, reject) => {
    const failRequest = (error: RequestError) => {
      reject(error)
    }

    uni.request({
      ...requestOptions,
      url: normalizeUrl(requestOptions.url),
      header,
      timeout: requestOptions.timeout || appConfig.timeout,
      success: (response) => {
        if (response.statusCode === HTTP_STATUS.unauthorized) {
          if (!skipUnauthorizedHandler) clearSession()
          failRequest(new RequestError('登录已过期，请重新登录', response.statusCode))
          return
        }

        if (response.statusCode < 200 || response.statusCode >= 300) {
          failRequest(
            new RequestError(`服务请求失败（${response.statusCode}）`, response.statusCode),
          )
          return
        }

        const body = response.data as ApiResponse<T>
        if (!body || typeof body.code !== 'number') {
          failRequest(new RequestError('服务返回格式不正确', -1))
          return
        }

        if (body.code === BUSINESS_CODE.unauthorized) {
          if (!skipUnauthorizedHandler) clearSession()
          failRequest(new RequestError('登录已过期，请重新登录', body.code, body.requestId))
          return
        }

        if (body.code !== BUSINESS_CODE.success) {
          failRequest(new RequestError(body.message || '业务处理失败', body.code, body.requestId))
          return
        }

        resolve(body.data)
      },
      fail: (error) => {
        failRequest(new RequestError(error.errMsg || '网络连接异常，请检查网络', -1))
      },
    })
  })
}

export function get<T>(
  url: string,
  data?: Record<string, any>,
  options: Partial<RequestOptions> = {},
) {
  return request<T>({ ...options, url, data, method: 'GET' })
}

export function post<T>(
  url: string,
  data?: Record<string, any>,
  options: Partial<RequestOptions> = {},
) {
  return request<T>({ ...options, url, data, method: 'POST' })
}
