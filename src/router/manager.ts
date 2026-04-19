import type { AppRoute, BackendRoute, MergedRoute, RouteTreeNode } from '@/types'

// 导入所有模块的路由配置
import { localRoutes } from '@/views/router'

/**
 * 路由管理器
 * 负责管理前端静态路由和后端动态路由的合并
 */
class RouteManager {
  private frontendRoutes: AppRoute[] = []
  private backendRoutes: AppRoute[] = []
  private mergedRoutes: MergedRoute[] = []

  constructor() {
    // 从 @/views/router 导入的所有本地路由
    this.frontendRoutes = [...localRoutes]
  }

  /**
   * 设置后端动态路由
   */
  setBackendRoutes(routes: BackendRoute[]): void {
    this.backendRoutes = routes
    console.log('✓ 后端路由已设置:', routes.length, '条')
  }

  /**
   * 获取后端动态路由（待开发，预留接口）
   */
  async fetchBackendRoutes(): Promise<BackendRoute[]> {
    try {
      // TODO: 从后端 API 获取路由配置
      // const response = await api.get('/user/routes')
      // return response.data

      // 临时返回空数组
      return []
    } catch (error) {
      console.error('Failed to fetch backend routes:', error)
      return []
    }
  }

  /**
   * 合并前端和后端路由
   */
  mergeRoutes(): MergedRoute[] {
    // 1. 按 order 排序前端路由
    const sortedFrontend = [...this.frontendRoutes].sort((a, b) => {
      const orderA = a.meta?.order ?? 999
      const orderB = b.meta?.order ?? 999
      return orderA - orderB
    })

    // 2. 按 order 排序后端路由
    const sortedBackend = [...this.backendRoutes].sort((a, b) => {
      const orderA = a.meta?.order ?? 999
      const orderB = b.meta?.order ?? 999
      return orderA - orderB
    })

    // 3. 合并路由（前端路由在前，后端路由在后）
    this.mergedRoutes = [...sortedFrontend, ...sortedBackend]

    console.log('✓ 路由合并完成:', {
      前端: sortedFrontend.length,
      后端: sortedBackend.length,
      总计: this.mergedRoutes.length,
    })

    return this.mergedRoutes
  }

  /**
   * 获取合并后的路由列表
   */
  getMergedRoutes(): MergedRoute[] {
    if (this.mergedRoutes.length === 0) {
      return this.mergeRoutes()
    }
    return this.mergedRoutes
  }

  /**
   * 获取完整的路由配置（包含本地路由、后端路由和系统路由）
   */
  getCompleteRoutes(): MergedRoute[] {
    const routes = this.getMergedRoutes()
    // 系统路由已经在 localRoutes 中，这里不需要额外添加
    return [...routes]
  }

  /**
   * 根据名称查找路由
   */
  findRouteByName(name: string): MergedRoute | undefined {
    return this.mergedRoutes.find((route) => route.name === name)
  }

  /**
   * 根据路径查找路由
   */
  findRouteByPath(path: string): MergedRoute | undefined {
    return this.mergedRoutes.find((route) => route.path === path)
  }

  /**
   * 获取可见的路由（用于菜单渲染）
   */
  getVisibleRoutes(): MergedRoute[] {
    return this.mergedRoutes.filter((route) => !route.meta?.hidden)
  }

  /**
   * 构建路由树（支持多级嵌套）
   */
  buildRouteTree(): RouteTreeNode[] {
    const routes = this.getMergedRoutes()
    const tree: RouteTreeNode[] = []
    const routeMap = new Map<string, RouteTreeNode>()

    // 第一遍：创建所有节点
    routes.forEach((route) => {
      const node: RouteTreeNode = {
        ...route,
        children: [],
      }
      routeMap.set(route.name, node)
    })

    // 第二遍：构建树形结构
    routes.forEach((route) => {
      const node = routeMap.get(route.name)
      if (!node) return

      if (route.meta?.parentName) {
        // 有父节点，添加到父节点的 children
        const parent = routeMap.get(route.meta.parentName)
        if (parent) {
          parent.children?.push(node)
        } else {
          // 父节点不存在，作为根节点
          tree.push(node)
        }
      } else {
        // 没有父节点，作为根节点
        tree.push(node)
      }
    })

    return tree
  }

  /**
   * 清空后端路由
   */
  clearBackendRoutes(): void {
    this.backendRoutes = []
    this.mergedRoutes = []
    console.log('✓ 后端路由已清空')
  }

  /**
   * 重置所有路由
   */
  reset(): void {
    this.backendRoutes = []
    this.mergedRoutes = []
    // 重新加载本地路由
    this.frontendRoutes = [...localRoutes]
    console.log('✓ 路由已重置')
  }
}

// 导出单例
export const routeManager = new RouteManager()
export default routeManager
