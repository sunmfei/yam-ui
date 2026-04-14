import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: '首页',
      keepAlive: true,
      requiresAuth: false, // 不需要登录
    },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue'),
    meta: {
      title: '关于',
      keepAlive: false,
      requiresAuth: false,
    },
  },
  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: '页面未找到',
      requiresAuth: false,
    },
  },
]

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
router.beforeEach(async (to, _from, next) => {
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
      // 没有 token，重定向到登录页（这里假设登录页是 /login）
      // 可以在 query 中保存当前路径，登录后跳转回来
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
    } else {
      // 有 token，检查用户信息是否存在
      if (!userStore.userInfo) {
        try {
          // 尝试从存储恢复或重新获取用户信息
          userStore.initFromStorage()

          // 如果仍然没有用户信息，可能需要重新登录
          if (!userStore.userInfo) {
            userStore.logout()
            next({
              path: '/login',
              query: { redirect: to.fullPath },
            })
            return
          }
        } catch (error) {
          console.error('Failed to restore user session:', error)
          userStore.logout()
          next({
            path: '/login',
            query: { redirect: to.fullPath },
          })
          return
        }
      }
      next()
    }
  } else {
    // 不需要登录的路由
    if (hasToken && to.path === '/login') {
      // 已登录用户访问登录页，重定向到首页
      next({ path: '/' })
    } else {
      next()
    }
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
