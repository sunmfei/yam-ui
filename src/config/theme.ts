import { computed } from 'vue'
import { darkTheme, lightTheme, type GlobalTheme } from 'naive-ui'
import { useAppStore } from '@/stores/app'

/**
 * naive-ui 主题配置
 */
export function useNaiveTheme() {
  const appStore = useAppStore()

  // 根据应用状态返回对应的 naive-ui 主题
  const naiveTheme = computed<GlobalTheme | null>(() => {
    return appStore.isDark ? darkTheme : lightTheme
  })

  // naive-ui 主题覆盖配置 - 自定义主题样式
  const themeOverrides = computed(() => {
    if (appStore.isDark) {
      return {
        common: {
          primaryColor: '#63e2b7',
          primaryColorHover: '#7ee8c3',
          primaryColorPressed: '#4dd4a8',
          primaryColorSuppl: '#7ee8c3',
        },
      }
    }
    return {
      common: {
        primaryColor: '#18a058',
        primaryColorHover: '#36ad6a',
        primaryColorPressed: '#0c7a43',
        primaryColorSuppl: '#36ad6a',
      },
    }
  })

  return {
    naiveTheme,
    themeOverrides,
  }
}
