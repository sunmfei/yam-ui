/**
 * Menu 模块路由配置
 */
import type { FrontendRoute } from '@/types'
import { RouteSource } from '@/types'

export const menuRoutes: FrontendRoute[] = [
  {
    name: 'MenuConfig',
    path: '/menu-demo-config',
    component: () => import('@/views/demo/menu/index.vue'),
    source: RouteSource.FRONTEND,
    meta: {
      title: '菜单配置',
      keepAlive: false,
      requiresAuth: false,
      icon: 'Menu',
      order: 50,
      hidden: true,
    },
  },
]
