/**
 * 路由来源常量
 */
export const RouteSource = {
  FRONTEND: 'frontend', // 前端静态路由
  BACKEND: 'backend', // 后端动态路由
} as const

export type RouteSourceType = (typeof RouteSource)[keyof typeof RouteSource]
