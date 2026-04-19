import type { MenuNode } from '@/types'

/**
 * 数据库存储菜单节点
 *
 * 纯 JSON 结构：
 * 不直接存函数，只存 key
 */
export interface DatabaseMenuNode {
  id?: string
  name: string
  icon?: string
  type: MenuNode['type']
  path?: string
  actionKey?: string
  onItemClickKey?: string
  getSelectedLabelKey?: string
  hidden?: boolean
  disabled?: boolean
  order?: number
  meta?: Record<string, unknown>
  children?: DatabaseMenuNode[]
}

/**
 * 数据库菜单转运行时菜单
 *
 * 核心职责：
 * 1. 恢复树结构
 * 2. 保持 actionKey（不注入函数）
 * 3. 保持 getSelectedLabelKey（不注入函数）
 */
export function convertDatabaseMenus(dbMenus: DatabaseMenuNode[], parentId = 'root'): MenuNode[] {
  return dbMenus.map((item, index) => {
    const id = item.id || `${parentId}-${index}`

    const node: MenuNode = {
      id,
      name: item.name,
      icon: item.icon,
      type: item.type,
      path: item.path,
      actionKey: item.actionKey,
      onItemClickKey: item.onItemClickKey,
      getSelectedLabelKey: item.getSelectedLabelKey,
      hidden: item.hidden,
      disabled: item.disabled,
      order: item.order,
      meta: item.meta,
    }

    /**
     * 递归恢复 children
     */
    if (Array.isArray(item.children)) {
      node.children = convertDatabaseMenus(item.children, id)
    }

    return node
  })
}

/**
 * 合并静态菜单 + 数据库菜单
 */
export function mergeMenus(staticMenus: MenuNode[], dbMenus: DatabaseMenuNode[]): MenuNode[] {
  return [...staticMenus, ...convertDatabaseMenus(dbMenus)].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  )
}
