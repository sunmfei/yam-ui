import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
import { routeManager } from './manager'

// 获取完整的路由配置（包含前端静态路由、后端动态路由和404）
const routes = routeManager.getCompleteRoutes()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    // 如果有保存的位置，返回到保存的位置
    if (savedPosition) {
      return savedPosition
    }
    // 如果目标路由有 hash，滚动到对应元素
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    // 否则滚动到顶部
    return { top: 0, behavior: 'smooth' }
  },
})

// 路由守卫
router.beforeEach(async (to, _from) => {
  const userStore = useUserStore()

  // 设置页面标题
  const title = to.meta.title as string
  document.title = title
    ? `${title} - ${import.meta.env.VITE_APP_TITLE || 'Yam UI'}`
    : import.meta.env.VITE_APP_TITLE || 'Yam UI'

  // 检查是否需要登录
  const requiresAuth = to.meta.requiresAuth !== false
  const hasToken = userStore.token

  if (requiresAuth) {
    // 需要登录的路由
    if (!hasToken) {
      // 没有 token，重定向到登录页
      return {
        path: '/login',
        query: { redirect: to.fullPath },
      }
    } else {
      // 有 token，检查用户信息是否存在
      if (!userStore.userInfo) {
        try {
          // 尝试从存储恢复或重新获取用户信息
          userStore.initFromStorage()

          // 如果仍然没有用户信息，可能需要重新登录
          if (!userStore.userInfo) {
            userStore.logout()
            return {
              path: '/login',
              query: { redirect: to.fullPath },
            }
          }
        } catch (error) {
          console.error('Failed to restore user session:', error)
          userStore.logout()
          return {
            path: '/login',
            query: { redirect: to.fullPath },
          }
        }
      }
      // 继续导航
      return true
    }
  } else {
    // 不需要登录的路由
    if (hasToken && to.path === '/login') {
      // 已登录用户访问登录页，重定向到首页
      return { path: '/' }
    }
    // 继续导航
    return true
  }
})

// 全局后置钩子 - 可以用于埋点、日志等
router.afterEach((_to, _from) => {
  // 可以在这里添加页面访问统计
  if (import.meta.env.PROD) {
    // 生产环境可以发送页面访问数据到分析平台
    // analytics.pageView(to.path)
  }
})

export default router

// 导出路由管理器和工具函数
export { routeManager } from './manager'
export { getMenuRoutes, getRouteTree, findRouteByName, hasRoute, logRoutes } from './utils'
export type { BackendRoute } from '@/types'
export { RouteSource } from '@/types'
