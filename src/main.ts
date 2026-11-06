import { createSSRApp } from 'vue'
import App from './App.vue'
import { pinia } from './stores'
import { i18n } from './locales'
import './styles/index.scss'

export function createApp() {
  const app = createSSRApp(App)

  app.use(pinia)
  app.use(i18n)

  return { app }
}
