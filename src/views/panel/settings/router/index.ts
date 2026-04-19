/**
 * Settings 模块路由配置
 */
import type { FrontendRoute } from '@/types'
import { RouteSource } from '@/types'

export const settingsRoutes: FrontendRoute[] = [
  {
    name: 'Settings',
    path: '/settings',
    component: () => import('@/views/panel/settings/SettingsView.vue'),
    source: RouteSource.FRONTEND,
    meta: {
      title: '系统设置',
      keepAlive: true,
      requiresAuth: false,
      icon: 'Settings',
      order: 3,
    },
  },
]
