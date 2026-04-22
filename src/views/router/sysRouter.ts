/**
 * 系统路由配置
 * TODO: 实现完整的系统路由
 */

import type { RouteRecordRaw } from 'vue-router'

// 基础路由
export const baseRoutes: RouteRecordRaw[] = []

// 认证路由
export const authRoutes: RouteRecordRaw[] = []

// 错误路由
export const errorRoutes: RouteRecordRaw[] = []

// 系统路由
export const systemRoutes: RouteRecordRaw[] = [
  ...baseRoutes,
  ...authRoutes,
  ...errorRoutes,
]
