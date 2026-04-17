import type { RouteRecordRaw } from 'vue-router'

/**
 * 路由来源类型
 */
export const RouteSource = {
  FRONTEND: 'frontend', // 前端静态路由
  BACKEND: 'backend', // 后端动态路由
} as const

export type RouteSource = (typeof RouteSource)[keyof typeof RouteSource]

/**
 * 扩展的路由元信息
 */
export interface AppRouteMeta {
  /** 页面标题 */
  title?: string
  /** 是否保持激活状态（keep-alive） */
  keepAlive?: boolean
  /** 是否需要认证 */
  requiresAuth?: boolean
  /** 角色权限 */
  roles?: string[]
  /** 图标 */
  icon?: string
  /** 排序权重 */
  order?: number
  /** 是否隐藏 */
  hidden?: boolean
  /** 路由来源 */
  source?: RouteSource
  /** 父级路由名称 */
  parentName?: string
  /** 额外数据 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extra?: Record<string, any>
}

/**
 * 应用路由配置
 */
export interface AppRoute extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  /** 路由名称（必填） */
  name: string
  /** 路由路径（必填） */
  path: string
  /** 元信息 */
  meta?: AppRouteMeta
  /** 子路由 */
  children?: AppRoute[]
  /** 路由来源 */
  source?: RouteSource
}

/**
 * 前端静态路由配置
 */
export interface FrontendRoute extends AppRoute {
  source: typeof RouteSource.FRONTEND
}

/**
 * 后端动态路由配置
 */
export interface BackendRoute extends AppRoute {
  source: typeof RouteSource.BACKEND
  /** 后端返回的路由 ID */
  id?: string | number
  /** 后端返回的组件路径 */
  componentPath?: string
}

/**
 * 合并后的完整路由列表
 */
export type MergedRoute = AppRoute

/**
 * 路由树节点
 */
export interface RouteTreeNode extends AppRoute {
  children?: RouteTreeNode[]
}
