import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { BackgroundType } from '@/types/background'
import { localCache, LocalCacheKey } from '@/utils/cache'

export const useAppStore = defineStore('app', () => {
  // State
  const isDark = ref(false)
  const sidebarCollapsed = ref(false)
  const language = ref('zh-CN')
  const backgroundType = ref<BackgroundType>('nature')

  // Getters
  const theme = computed(() => (isDark.value ? 'dark' : 'light'))

  // Actions
  function toggleTheme() {
    isDark.value = !isDark.value
    updateThemeClass()
  }

  function setTheme(dark: boolean) {
    isDark.value = dark
    updateThemeClass()
  }

  function updateThemeClass() {
    // 更新 DOM class
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // 保存到本地缓存
    localCache.set(LocalCacheKey.THEME, isDark.value ? 'dark' : 'light')
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

    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
      updateThemeClass()
    } else {
      // 检测系统主题偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = prefersDark
      updateThemeClass()
    }

    if (savedLanguage) {
      language.value = savedLanguage
    }

    if (savedBackgroundType) {
      backgroundType.value = savedBackgroundType
    }
  }

  // 监听主题变化，自动保存
  watch(isDark, () => {
    updateThemeClass()
  })

  return {
    // State
    isDark,
    sidebarCollapsed,
    language,
    backgroundType,
    // Getters
    theme,
    // Actions
    toggleTheme,
    setTheme,
    toggleSidebar,
    setLanguage,
    setBackgroundType,
    initFromStorage,
  }
})
