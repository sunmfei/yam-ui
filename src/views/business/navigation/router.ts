import type { AppRoute } from '@/types'

/**
 * 网址导航路由配置
 */
export const navigationRoutes: AppRoute[] = [
  {
    path: '/navigation',
    name: 'Navigation',
    component: () => import('@/views/business/navigation/index.vue'),
    meta: {
      title: '网址导航',
      icon: 'Globe',
      order: 10,
      requiresAuth: false,
    },
  },
]
