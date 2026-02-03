/**
 * 主题管理工具
 * 支持动态切换主题，通过修改 data-theme 属性实现
 */

export type ThemeName = 'tech-blue' | 'cyber-purple' | 'dark-night' | 'minimal-white' | 'warm-orange' | 'deep-space' | 'auto'

const THEME_STORAGE_KEY = 'download-manager-theme'
const AUTO_THEME_ENABLED_KEY = 'download-manager-auto-theme-enabled'

/**
 * 判断当前时间是白天还是晚上
 * 白天：6:00 - 18:00
 * 晚上：18:00 - 6:00
 */
const isDaytime = (): boolean => {
  const now = new Date()
  const hour = now.getHours()
  return hour >= 6 && hour < 18
}

/**
 * 根据时间自动选择主题
 */
const getAutoTheme = (): Exclude<ThemeName, 'auto'> => {
  return isDaytime() ? 'minimal-white' : 'dark-night'
}

/**
 * 检查是否启用了自动主题
 */
export const isAutoThemeEnabled = (): boolean => {
  if (typeof localStorage === 'undefined') return false
  const stored = localStorage.getItem(AUTO_THEME_ENABLED_KEY)
  return stored === 'true'
}

/**
 * 设置自动主题启用状态
 */
export const setAutoThemeEnabled = (enabled: boolean): void => {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(AUTO_THEME_ENABLED_KEY, enabled ? 'true' : 'false')

  // 如果启用自动主题，立即应用
  if (enabled) {
    const autoTheme = getAutoTheme()
    const root = document.documentElement
    root.setAttribute('data-theme', autoTheme)

    // 触发主题变更事件
    if (typeof window !== 'undefined' && window.CustomEvent) {
      window.dispatchEvent(new window.CustomEvent('theme-change', { detail: { theme: autoTheme, isAuto: true }}))
    }
  }
}

/**
 * 获取当前主题
 */
export const getCurrentTheme = (): ThemeName => {
  if (typeof document === 'undefined') return 'minimal-white'

  // 如果启用了自动主题，返回自动主题
  if (isAutoThemeEnabled()) {
    return 'auto'
  }

  const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null
  if (stored && isValidTheme(stored)) {
    return stored
  }

  // 默认使用明亮现代主题
  return 'minimal-white'
}

/**
 * 获取实际应用的主题（如果是auto，则返回对应的主题）
 */
export const getActualTheme = (): Exclude<ThemeName, 'auto'> => {
  if (isAutoThemeEnabled()) {
    return getAutoTheme()
  }
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null
  if (stored && stored !== 'auto' && isValidTheme(stored)) {
    return stored as Exclude<ThemeName, 'auto'>
  }
  return 'minimal-white'
}

/**
 * 设置主题
 */
export const setTheme = (theme: ThemeName): void => {
  if (typeof document === 'undefined') return

  if (!isValidTheme(theme) && theme !== 'auto') {
    console.warn(`Invalid theme: ${theme}`)
    return
  }

  const root = document.documentElement

  // 如果设置为auto，启用自动主题
  if (theme === 'auto') {
    setAutoThemeEnabled(true)
    const actualTheme = getAutoTheme()
    root.setAttribute('data-theme', actualTheme)
    localStorage.setItem(THEME_STORAGE_KEY, 'auto')

    // 触发主题变更事件
    if (typeof window !== 'undefined' && window.CustomEvent) {
      window.dispatchEvent(new window.CustomEvent('theme-change', { detail: { theme: actualTheme, isAuto: true }}))
    }
  } else {
    // 设置为具体主题，禁用自动主题
    setAutoThemeEnabled(false)
    root.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)

    // 触发主题变更事件
    if (typeof window !== 'undefined' && window.CustomEvent) {
      window.dispatchEvent(new window.CustomEvent('theme-change', { detail: { theme, isAuto: false }}))
    }
  }
}

/**
 * 验证主题名称是否有效
 */
const isValidTheme = (theme: string): theme is ThemeName => {
  return ['tech-blue', 'cyber-purple', 'dark-night', 'minimal-white', 'warm-orange', 'deep-space', 'auto'].includes(theme)
}

/**
 * 检查并更新自动主题（如果启用）
 */
const checkAndUpdateAutoTheme = (): void => {
  if (typeof document === 'undefined') return

  if (isAutoThemeEnabled()) {
    const autoTheme = getAutoTheme()
    const currentActualTheme = document.documentElement.getAttribute('data-theme')

    // 如果当前主题与自动主题不一致，更新主题
    if (currentActualTheme !== autoTheme) {
      document.documentElement.setAttribute('data-theme', autoTheme)

      // 触发主题变更事件
      if (typeof window !== 'undefined' && window.CustomEvent) {
        window.dispatchEvent(new window.CustomEvent('theme-change', { detail: { theme: autoTheme, isAuto: true }}))
      }
    }
  }
}

/**
 * 初始化主题
 */
export const initTheme = (): void => {
  if (typeof document === 'undefined') return

  const theme = getCurrentTheme()
  setTheme(theme)

  // 如果启用了自动主题，设置定时检查（每小时检查一次）
  if (isAutoThemeEnabled()) {
    // 立即检查一次
    checkAndUpdateAutoTheme()

    // 设置定时检查（每小时检查一次）
    setInterval(() => {
      checkAndUpdateAutoTheme()
    }, 60 * 60 * 1000) // 1小时

    // 监听时间变化（每分钟检查一次，确保在小时切换时及时更新）
    setInterval(() => {
      checkAndUpdateAutoTheme()
    }, 60 * 1000) // 1分钟
  }
}

/**
 * 获取主题列表
 */
export const getThemeList = (): Array<{ name: ThemeName; label: string }> => {
  return [
    { name: 'auto', label: '自动' },
    { name: 'minimal-white', label: '明亮现代' },
    { name: 'tech-blue', label: '科技蓝' },
    { name: 'cyber-purple', label: '数字薰衣草' },
    { name: 'warm-orange', label: '温暖橙色' },
    { name: 'dark-night', label: '柔和深色' },
    { name: 'deep-space', label: '深空黑' }
  ]
}

