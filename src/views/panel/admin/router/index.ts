/**
 * Admin 模块路由配置
 */
import type { FrontendRoute } from '@/types'
import { RouteSource } from '@/types'

export const adminRoutes: FrontendRoute[] = [
  {
    name: 'Admin',
    path: '/admin',
    component: () => import('@/views/panel/admin/AdminView.vue'),
    source: RouteSource.FRONTEND,
    meta: {
      title: '管理后台',
      keepAlive: true,
      requiresAuth: false,
      icon: 'Settings',
      order: 3,
    },
  },
]
