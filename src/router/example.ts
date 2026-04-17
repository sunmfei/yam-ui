/**
 * 路由系统使用示例
 */

import {
  routeManager,
  getMenuRoutes,
  getRouteTree,
  findRouteByName,
  hasRoute,
  logRoutes,
  type BackendRoute,
  RouteSource,
} from '@/router'

// ==================== 1. 基本使用 ====================

/**
 * 获取所有可见路由（用于菜单）
 */
export function renderMenu() {
  const routes = getMenuRoutes()
  console.log('菜单路由:', routes)

  // 渲染菜单...
  return routes.map((route: any) => ({
    name: route.name,
    path: route.path,
    title: route.meta?.title,
    icon: route.meta?.icon,
  }))
}

/**
 * 获取路由树（用于多级菜单）
 */
export function renderMultiLevelMenu() {
  const tree = getRouteTree()
  console.log('路由树:', tree)

  // 递归渲染菜单树...
  return tree
}

// ==================== 2. 后端动态路由 ====================

/**
 * 从后端获取并设置路由
 */
export async function loadBackendRoutes() {
  try {
    // 方式1：手动设置后端路由
    const backendRoutes: BackendRoute[] = [
      {
        id: 1,
        name: 'Dashboard',
        path: '/dashboard',
        componentPath: '@/views/DashboardView.vue', // 后端返回的组件路径
        source: RouteSource.BACKEND,
        meta: {
          title: '仪表盘',
          requiresAuth: true,
          roles: ['admin'],
          icon: 'DataAnalysis',
          order: 10,
        },
      },
      {
        id: 2,
        name: 'Settings',
        path: '/settings',
        componentPath: '@/views/SettingsView.vue',
        source: RouteSource.BACKEND,
        meta: {
          title: '设置',
          requiresAuth: true,
          icon: 'Setting',
          order: 20,
        },
      },
    ]

    routeManager.setBackendRoutes(backendRoutes)

    // 方式2：从 API 获取（待实现）
    // const routes = await routeManager.fetchBackendRoutes()
    // routeManager.setBackendRoutes(routes)

    console.log('✓ 后端路由加载成功')
  } catch (error) {
    console.error('✗ 后端路由加载失败:', error)
  }
}

/**
 * 登出时清空后端路由
 */
export function clearBackendRoutesOnLogout() {
  routeManager.clearBackendRoutes()
  console.log('✓ 后端路由已清空')
}

// ==================== 3. 路由查询 ====================

/**
 * 检查路由是否存在
 */
export function checkRouteExists(nameOrPath: string): boolean {
  return hasRoute(nameOrPath)
}

/**
 * 根据名称获取路由
 */
export function getRouteInfo(name: string) {
  const route = findRouteByName(name)
  if (!route) {
    console.warn(`路由 "${name}" 不存在`)
    return null
  }

  return {
    name: route.name,
    path: route.path,
    title: route.meta?.title,
    requiresAuth: route.meta?.requiresAuth,
    source: route.meta?.source,
  }
}

// ==================== 4. 调试工具 ====================

/**
 * 打印所有路由信息
 */
export function debugRoutes() {
  logRoutes()
}

/**
 * 查看路由管理器状态
 */
export function inspectRouteManager() {
  console.group('🔍 路由管理器状态')
  console.log(
    '前端路由数:',
    routeManager.getMergedRoutes().filter((r: any) => r.meta?.source === 'frontend').length
  )
  console.log(
    '后端路由数:',
    routeManager.getMergedRoutes().filter((r: any) => r.meta?.source === 'backend').length
  )
  console.log('总路由数:', routeManager.getMergedRoutes().length)
  console.groupEnd()
}

// ==================== 5. 实际应用示例 ====================

/**
 * 应用初始化时加载路由
 */
export async function initAppRoutes() {
  // 1. 前端静态路由已经自动加载

  // 2. 如果有 token，加载后端路由
  const token = localStorage.getItem('token')
  if (token) {
    await loadBackendRoutes()
  }

  // 3. 打印路由信息（开发环境）
  if (import.meta.env.DEV) {
    debugRoutes()
  }
}

/**
 * 在组件中使用
 */
export function useInComponent() {
  // 获取菜单路由
  const menuRoutes = getMenuRoutes()

  // 检查某个路由是否存在
  const hasDashboard = hasRoute('Dashboard')

  // 查找特定路由
  const homeRoute = findRouteByName('Home')

  return {
    menuRoutes,
    hasDashboard,
    homeRoute,
  }
}
