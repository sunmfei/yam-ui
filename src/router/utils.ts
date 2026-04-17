import type { AppRoute, RouteTreeNode } from '@/types/route'
import { routeManager } from './manager'

/**
 * 获取所有路由（用于菜单渲染）
 */
export function getMenuRoutes(): AppRoute[] {
  return routeManager.getVisibleRoutes()
}

/**
 * 获取路由树（用于多级菜单）
 */
export function getRouteTree(): RouteTreeNode[] {
  return routeManager.buildRouteTree()
}

/**
 * 根据名称查找路由
 */
export function findRouteByName(name: string): AppRoute | undefined {
  return routeManager.findRouteByName(name)
}

/**
 * 根据路径查找路由
 */
export function findRouteByPath(path: string): AppRoute | undefined {
  return routeManager.findRouteByPath(path)
}

/**
 * 检查路由是否存在
 */
export function hasRoute(nameOrPath: string): boolean {
  return !!routeManager.findRouteByName(nameOrPath) || !!routeManager.findRouteByPath(nameOrPath)
}

/**
 * 格式化路由信息（用于调试）
 */
export function formatRoutes(routes: AppRoute[]): void {
  console.group('📋 路由列表')
  routes.forEach((route, index) => {
    console.log(
      `${index + 1}. ${route.name} (${route.path})`,
      route.meta?.title ? `- ${route.meta.title}` : '',
      route.meta?.source ? `[${route.meta.source}]` : ''
    )
  })
  console.groupEnd()
}

/**
 * 打印当前所有路由
 */
export function logRoutes(): void {
  const routes = routeManager.getMergedRoutes()
  formatRoutes(routes)

  console.log('\n📊 路由统计:')
  console.log('  前端路由:', routes.filter((r) => r.meta?.source === 'frontend').length)
  console.log('  后端路由:', routes.filter((r) => r.meta?.source === 'backend').length)
  console.log('  总计:', routes.length)
}
