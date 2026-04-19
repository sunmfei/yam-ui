/**
 * 路由模块统一出口
 */

// 类型导出
export type {
  AppRoute,
  FrontendRoute,
  BackendRoute,
  MergedRoute,
  RouteTreeNode,
  AppRouteMeta,
  RouteSource,
} from '@/types'

// 路由管理器
export { routeManager } from './manager'

// 本地路由汇总（从 views/router 导出）
export { localRoutes, localRouter } from '@/views/router'

// 系统路由细分（可选导出）
export { baseRoutes, authRoutes, errorRoutes, systemRoutes } from '@/views/router/sysRouter'

// 工具函数
export {
  getMenuRoutes,
  getRouteTree,
  findRouteByName,
  findRouteByPath,
  hasRoute,
  formatRoutes,
  logRoutes,
} from './utils'
