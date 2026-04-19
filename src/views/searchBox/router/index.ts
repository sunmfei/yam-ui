/**
 * Search 模块路由配置
 */
import type { FrontendRoute } from '@/types'
import { RouteSource } from '@/types'

export const searchRoutes: FrontendRoute[] = [
  {
    name: 'Search',
    path: '/searchBox',
    component: () => import('@/views/searchBox/index.vue'),
    source: RouteSource.FRONTEND,
    meta: {
      title: '搜索',
      keepAlive: true,
      requiresAuth: false,
      icon: 'Search',
      order: 2,
    },
  },
]
