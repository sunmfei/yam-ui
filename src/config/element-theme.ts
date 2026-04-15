import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

/**
 * Element Plus 主题配置
 */
export function useElementTheme() {
  const appStore = useAppStore()

  // 根据主题返回对应的 CSS 类
  const themeClass = computed(() => {
    return appStore.isDark ? 'dark' : ''
  })

  // 自定义 CSS 变量（可选）
  const customProperties = computed(() => {
    if (appStore.isDark) {
      return {
        // 深色模式下的透明背景
        '--el-bg-color': 'rgba(30, 41, 59, 0.7)',
        '--el-bg-color-page': 'rgba(15, 23, 42, 0.8)',
        '--el-bg-color-overlay': 'rgba(51, 65, 85, 0.8)',
      }
    }
    return {
      // 亮色模式下的透明背景
      '--el-bg-color': 'rgba(255, 255, 255, 0.7)',
      '--el-bg-color-page': 'rgba(248, 250, 252, 0.8)',
      '--el-bg-color-overlay': 'rgba(255, 255, 255, 0.9)',
    }
  })

  return {
    themeClass,
    customProperties,
  }
}
