import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface UserInfo {
  id: string
  name: string
  avatar?: string
  email?: string
  roles?: string[]
  permissions?: string[]
}

export const useUserStore = defineStore('user', () => {
  // State
  const userInfo = ref<UserInfo | null>(null)
  const token = ref<string>('')
  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)

  // Getters
  const userName = computed(() => userInfo.value?.name || '')
  const userAvatar = computed(() => userInfo.value?.avatar || '')
  const userRoles = computed(() => userInfo.value?.roles || [])
  const userPermissions = computed(() => userInfo.value?.permissions || [])

  // Actions
  function login(user: UserInfo, userToken: string) {
    userInfo.value = user
    token.value = userToken

    // 保存到 localStorage
    saveToStorage()
  }

  function logout() {
    userInfo.value = null
    token.value = ''

    // 清除 localStorage
    clearStorage()
  }

  function updateUserInfo(user: Partial<UserInfo>) {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...user }
      saveToStorage()
    }
  }

  function initFromStorage() {
    try {
      const savedToken = localStorage.getItem('token')
      const savedUserInfo = localStorage.getItem('userInfo')

      if (savedToken && savedUserInfo) {
        token.value = savedToken
        userInfo.value = JSON.parse(savedUserInfo)
      }
    } catch (error) {
      console.error('Failed to parse user info from storage:', error)
      // 如果解析失败，清除无效数据
      clearStorage()
    }
  }

  // 私有方法：保存到存储
  function saveToStorage() {
    try {
      if (token.value) {
        localStorage.setItem('token', token.value)
      }
      if (userInfo.value) {
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      }
    } catch (error) {
      console.error('Failed to save user data to storage:', error)
    }
  }

  // 私有方法：清除存储
  function clearStorage() {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    } catch (error) {
      console.error('Failed to clear user data from storage:', error)
    }
  }

  // 检查是否有某个权限
  function hasPermission(permission: string): boolean {
    return userPermissions.value.includes(permission)
  }

  // 检查是否有某个角色
  function hasRole(role: string): boolean {
    return userRoles.value.includes(role)
  }

  return {
    // State
    userInfo,
    token,
    // Getters
    isLoggedIn,
    userName,
    userAvatar,
    userRoles,
    userPermissions,
    // Actions
    login,
    logout,
    updateUserInfo,
    initFromStorage,
    hasPermission,
    hasRole,
  }
})
