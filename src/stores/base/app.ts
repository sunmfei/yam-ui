import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useColorMode } from '@vueuse/core'
import type { BackgroundType } from '@/types'
import { localCache, LocalCacheKey } from '@/utils/cache'

export const useAppStore = defineStore('app', () => {
  // 使用 @vueuse/core 的 useColorMode 管理主题
  const mode = useColorMode({
    initialValue: 'auto',
    disableTransition: false,
  })

  // State
  const sidebarCollapsed = ref(false)
  const language = ref('zh-CN')
  const backgroundType = ref<BackgroundType>('sakura')

  // Getters - 计算属性，从 mode 派生 isDark
  const isDark = computed(() => mode.value === 'dark')
  const theme = computed(() => mode.value)

  // Actions
  function toggleTheme() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }

  function setTheme(dark: boolean) {
    mode.value = dark ? 'dark' : 'light'
  }

  function setAutoTheme() {
    mode.value = 'auto'
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setLanguage(lang: string) {
    language.value = lang
    // 保存到本地缓存
    localCache.set(LocalCacheKey.LANGUAGE, lang)
  }

  function setBackgroundType(type: BackgroundType) {
    backgroundType.value = type
    // 保存到本地缓存
    localCache.set(LocalCacheKey.BACKGROUND_TYPE, type)
  }

  // 初始化：从本地缓存恢复设置
  function initFromStorage() {
    const savedTheme = localCache.get<string>(LocalCacheKey.THEME)
    const savedLanguage = localCache.get<string>(LocalCacheKey.LANGUAGE)
    const savedBackgroundType = localCache.get<BackgroundType>(LocalCacheKey.BACKGROUND_TYPE)

    // 恢复主题设置（useColorMode 会自动处理 DOM class）
    if (savedTheme) {
      mode.value = savedTheme as 'light' | 'dark' | 'auto'
    }

    if (savedLanguage) {
      language.value = savedLanguage
    }

    if (savedBackgroundType) {
      backgroundType.value = savedBackgroundType
    }
  }

  return {
    // State
    sidebarCollapsed,
    language,
    backgroundType,
    // Getters
    isDark,
    theme,
    // Actions
    toggleTheme,
    setTheme,
    setAutoTheme,
    toggleSidebar,
    setLanguage,
    setBackgroundType,
    initFromStorage,
  }
})
