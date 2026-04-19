import type { MenuNode } from '@/types'
import { useRouter } from 'vue-router'
import actionHub from '@/types'

/**
 * 判断是否路由菜单
 */
export function isRouteMenu(menu: MenuNode): boolean {
  return typeof menu.path === 'string' && menu.path.length > 0
}

/**
 * 判断是否动作菜单（registry模式）
 */
export function isActionMenu(menu: MenuNode): boolean {
  return typeof menu.actionKey === 'string' && menu.actionKey.length > 0
}

/**
 * 点击菜单统一入口
 *
 * 核心思想：
 * 不直接调用 action
 * 统一走 actionKey registry
 */
export async function handleMenuClick(
  menu: MenuNode,
  router?: ReturnType<typeof useRouter>
): Promise<void> {
  try {
    console.log(`🎯 点击菜单: ${menu.name}`)

    /**
     * 1. 优先执行 actionKey
     */
    if (menu.actionKey) {
      await actionHub.executeAction(menu.actionKey)
      return
    }

    /**
     * 2. 路由跳转
     */
    if (isRouteMenu(menu) && router) {
      const path = menu.path!

      if (path.startsWith('/')) {
        await router.push(path)
      } else if (path.startsWith('http')) {
        window.open(path, '_blank')
      }

      return
    }

    console.log(`ℹ️ 未定义行为: ${menu.name}`)
  } catch (err) {
    console.error(`❌ 菜单执行失败: ${menu.name}`, err)
  }
}

/**
 * 是否有子菜单
 */
export function hasChildren(menu: MenuNode): boolean {
  return Array.isArray(menu.children) && menu.children.length > 0
}

/**
 * 扁平化菜单（保留所有节点）
 *
 * 用于：
 * - 搜索
 * - 权限过滤
 * - 菜单索引
 */
export function flattenMenus(menus: MenuNode[]): MenuNode[] {
  const result: MenuNode[] = []

  const traverse = (items: MenuNode[]) => {
    for (const item of items) {
      result.push(item)

      if (item.children) {
        traverse(item.children)
      }
    }
  }

  traverse(menus)

  return result
}

/**
 * 根据 path 或 actionKey 查找菜单
 */
export function findMenu(menus: MenuNode[], key: string): MenuNode | null {
  for (const menu of menus) {
    if (menu.path === key || menu.actionKey === key) {
      return menu
    }

    if (menu.children) {
      const found = findMenu(menu.children, key)
      if (found) return found
    }
  }

  return null
}
