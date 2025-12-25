/**
 * Tooltip 全局配置工具
 * 统一管理所有 Tooltip 组件的默认配置
 * 
 * 注意：由于 Element Plus 不支持全局配置 Tooltip 的默认属性，
 * 需要在每个 el-tooltip 组件中手动添加 :show-after="600"
 * 
 * 如需修改延迟时间，请全局搜索并替换所有 :show-after="600" 的值
 */
export const TOOLTIP_DEFAULT_CONFIG = {
  showAfter: 600 // 延迟出现时间（毫秒）
} as const

