import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const isDark = ref(false)
  const sidebarCollapsed = ref(false)
  const language = ref('zh-CN')

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
    // 保存到 localStorage
    try {
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    } catch (error) {
      console.error('Failed to save theme preference:', error)
    }
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setLanguage(lang: string) {
    language.value = lang
    // 保存到 localStorage
    try {
      localStorage.setItem('language', lang)
    } catch (error) {
      console.error('Failed to save language preference:', error)
    }
  }

  // 初始化：从 localStorage 恢复设置
  function initFromStorage() {
    try {
      const savedTheme = localStorage.getItem('theme')
      const savedLanguage = localStorage.getItem('language')

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
    } catch (error) {
      console.error('Failed to restore app settings from storage:', error)
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
    // Getters
    theme,
    // Actions
    toggleTheme,
    setTheme,
    toggleSidebar,
    setLanguage,
    initFromStorage,
  }
})
