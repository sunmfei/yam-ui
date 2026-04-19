/**
 * Navigation Management 模块路由配置
 */
import type { FrontendRoute } from '@/types'
import { RouteSource } from '@/types'

export const navigationRoutes: FrontendRoute[] = [
  {
    name: 'NavigationConfig',
    path: '/navigation-config',
    component: () => import('@/views/panel/components/NavigationManagement/index.vue'),
    source: RouteSource.FRONTEND,
    meta: {
      title: '菜单管理',
      keepAlive: false,
      requiresAuth: false,
      icon: 'Navigation',
      order: 50,
      hidden: true, // 隐藏在侧边栏，通过 Settings 访问
    },
  },
]
