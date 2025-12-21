/**
 * Vue 3 应用入口文件
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// @ts-ignore
import zhTw from 'element-plus/dist/locale/zh-tw.mjs'
// @ts-ignore
import en from 'element-plus/dist/locale/en.mjs'
// @ts-ignore
import ja from 'element-plus/dist/locale/ja.mjs'
import { initTheme } from '@/utils/theme'
import { initI18n } from '@/i18n'
import App from './App.vue'
import './styles/main.scss'

try {
  initTheme()
} catch (error) {
  console.error('Failed to initialize theme:', error)
}

const bootstrap = async() => {
  const app = createApp(App)

  const pinia = createPinia()
  app.use(pinia)

  const i18n = await initI18n()
  app.use(i18n)

  // Element Plus 全局配置（默认语言，实际语言由 ElConfigProvider 控制）
  app.use(ElementPlus, {
    locale: zhCn // 默认使用中文，实际语言由 App.vue 中的 ElConfigProvider 动态控制
  })

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  try {
    app.mount('#app')
  } catch (error) {
    console.error('Failed to mount Vue app:', error)
  }
}

bootstrap().catch(error => {
  console.error('Failed to bootstrap app:', error)
})
