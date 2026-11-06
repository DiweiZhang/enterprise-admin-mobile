const ENV = {
  development: {
    title: 'MES 企业移动管理（开发）',
    apiBaseURL: 'https://dev-api.example.com',
    useMock: true,
  },
  production: {
    title: 'MES 企业移动管理',
    apiBaseURL: 'https://api.example.com',
    useMock: false,
  },
}

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
const defaults = ENV[mode]

export const appConfig = {
  title: import.meta.env.VITE_APP_TITLE || defaults.title,
  apiBaseURL: import.meta.env.VITE_API_BASE_URL || defaults.apiBaseURL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT || 15000),
  useMock: import.meta.env.VITE_USE_MOCK
    ? import.meta.env.VITE_USE_MOCK === 'true'
    : defaults.useMock,
} as const
