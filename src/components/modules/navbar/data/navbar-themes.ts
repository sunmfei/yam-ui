/**
 * 导航栏主题配�?
 * 提供多种预设样式主题
 */

export interface NavbarThemeConfig {
  light: string
  dark: string
  blur: string
  borderColor: string
  darkBorderColor: string
  padding: string
}

/**
 * 预设主题配置
 */
export const NAVBAR_THEMES = {
  // 透明主题 - 完全透明无边�?
  transparent: {
    light: 'transparent',
    dark: 'transparent',
    blur: '0px',
    borderColor: 'transparent',
    darkBorderColor: 'transparent',
    padding: '0.75rem 1.5rem',
  },

  // 磨砂玻璃主题 - 轻微模糊半透明
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    dark: 'rgba(30, 41, 59, 0.3)',
    blur: '10px',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    darkBorderColor: 'rgba(255, 255, 255, 0.05)',
    padding: '0.75rem 1.5rem',
  },

  // 强磨砂主�?- 更强模糊效果
  frosted: {
    light: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(30, 41, 59, 0.5)',
    blur: '20px',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    darkBorderColor: 'rgba(255, 255, 255, 0.1)',
    padding: '0.75rem 1.5rem',
  },

  // 纯色主题 - 不透明背景
  solid: {
    light: '#ffffff',
    dark: '#1e293b',
    blur: '0px',
    borderColor: '#e2e8f0',
    darkBorderColor: '#334155',
    padding: '0.75rem 1.5rem',
  },

  // 浅色主题 - 白色半透明
  light: {
    light: 'rgba(255, 255, 255, 0.8)',
    dark: 'rgba(30, 41, 59, 0.8)',
    blur: '15px',
    borderColor: 'rgba(0, 0, 0, 0.05)',
    darkBorderColor: 'rgba(255, 255, 255, 0.05)',
    padding: '0.75rem 1.5rem',
  },
} as const satisfies Record<string, NavbarThemeConfig>

export type NavbarTheme = keyof typeof NAVBAR_THEMES
