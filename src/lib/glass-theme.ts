/**
 * 玻璃态效果工具类
 * 提供统一的毛玻璃和半透明样式
 */

/**
 * 玻璃态卡片基础样式
 * - 半透明背景
 * - 细边框
 * - 柔和阴影（光晕效果）
 */
export const glassCard = {
  // 亮色模式
  light:
    'border border-gray-200/50 bg-white/60 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] backdrop-blur-sm',
  // 深色模式
  dark: 'border border-slate-700/30 bg-slate-800/20 shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] backdrop-blur-sm',
}

/**
 * 玻璃态卡片 - 更强透明度
 */
export const glassCardLight = {
  light:
    'border border-gray-200/40 bg-white/40 shadow-[0_0_40px_-10px_rgba(0,0,0,0.08)] backdrop-blur-sm',
  dark: 'border border-slate-700/20 bg-slate-800/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.2)] backdrop-blur-sm',
}

/**
 * 玻璃态开关（Switch）
 */
export const glassSwitch = {
  // 未选中状态
  unchecked: {
    light: 'border border-gray-300/50 bg-gray-100/50',
    dark: 'border border-slate-600/30 bg-slate-700/20',
  },
  // 选中状态
  checked: 'border border-primary/30 bg-primary/20 backdrop-blur-sm',
}

/**
 * 玻璃态输入框
 */
export const glassInput = {
  light:
    'border border-gray-200/50 bg-white/40 backdrop-blur-sm focus:border-primary/50 focus:bg-white/60',
  dark: 'border border-slate-700/30 bg-slate-800/20 backdrop-blur-sm focus:border-primary/40 focus:bg-slate-800/30',
}

/**
 * 玻璃态按钮
 */
export const glassButton = {
  light: 'border border-gray-200/50 bg-white/40 hover:bg-white/60 backdrop-blur-sm',
  dark: 'border border-slate-700/30 bg-slate-800/20 hover:bg-slate-800/30 backdrop-blur-sm',
}

/**
 * 根据主题获取玻璃态卡片类名
 */
export function getGlassCardClass(
  isDark: boolean,
  variant: 'default' | 'light' = 'default'
): string {
  const classes = variant === 'light' ? glassCardLight : glassCard
  return isDark ? classes.dark : classes.light
}

/**
 * 根据主题获取 Switch 类名
 */
export function getSwitchClass(isDark: boolean, isChecked: boolean): string {
  if (isChecked) {
    return glassSwitch.checked
  }
  return isDark ? glassSwitch.unchecked.dark : glassSwitch.unchecked.light
}
