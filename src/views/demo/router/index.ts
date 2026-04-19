import type { FrontendRoute } from '@/types'
import { RouteSource } from '@/types'

export const demoRouter: FrontendRoute[] = [
  {
    name: 'demoRouter',
    path: '/demoRouter',
    component: () => import('@/views/demo/index.vue'),
    source: RouteSource.FRONTEND,
    meta: {
      title: 'demoRouter',
      keepAlive: false,
      requiresAuth: false,
      icon: 'Menu',
      order: 50,
      hidden: true,
    },
  },
]
