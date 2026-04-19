/**
 * 路由来源常量
 */
export const RouteSource = {
  FRONTEND: 'frontend',
  BACKEND: 'backend',
} as const

export type RouteSourceType = (typeof RouteSource)[keyof typeof RouteSource]
