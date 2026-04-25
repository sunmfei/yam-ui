import type { FrontendRoute } from '@/types'
import { RouteSource } from '@/types'

export const authRoutes: FrontendRoute[] = [
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/auth/LoginView.vue'),
    source: RouteSource.FRONTEND,
    meta: {
      title: '统一登录',
      requiresAuth: false,
      hidden: true,
    },
  },
  {
    name: 'AuthCallback',
    path: '/callback',
    component: () => import('@/views/auth/CallbackView.vue'),
    source: RouteSource.FRONTEND,
    meta: {
      title: '登录回调',
      requiresAuth: false,
      hidden: true,
    },
  },
]
