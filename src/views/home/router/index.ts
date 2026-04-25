/**
 * 系统路由配置（404、登录等）
 * 这些路由是应用级别的基础路由
 */
import type { FrontendRoute } from '@/types'
import { RouteSource } from '@/types'

/**
 * 基础页面路由
 */
export const baseRoutes: FrontendRoute[] = [
  {
    name: 'Home',
    path: '/',
    component: () => import('@/views/home/HomeView.vue'),
    source: RouteSource.FRONTEND,
    meta: {
      title: '首页',
      keepAlive: true,
      requiresAuth: false,
      icon: 'HomeFilled',
      order: 1,
    },
  },
  {
    name: 'About',
    path: '/about',
    component: () => import('@/views/home/AboutView.vue'),
    source: RouteSource.FRONTEND,
    meta: {
      title: '关于',
      keepAlive: false,
      requiresAuth: false,
      icon: 'InfoFilled',
      order: 99,
    },
  },
]

/**
 * 认证相关路由
 */
export const authRoutes: FrontendRoute[] = []

/**
 * 错误页面路由
 */
export const errorRoutes: FrontendRoute[] = [
  {
    name: 'NotFound',
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/home/NotFoundView.vue'),
    source: RouteSource.FRONTEND,
    meta: {
      title: '页面未找到',
      requiresAuth: false,
      hidden: true,
    },
  },
]

/**
 * 所有系统路由（按顺序合并）
 */
export const systemRoutes: FrontendRoute[] = [...baseRoutes, ...authRoutes, ...errorRoutes]
