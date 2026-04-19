import type { MenuNode } from '@/types'

/**
 * 菜单管理 API
 *
 * TODO: 后期替换为真实的后端接口调用
 * 当前使用模拟数据用于开发和测试
 */

/**
 * 获取所有菜单数据
 * @returns 菜单节点数组
 */
export async function getMenus(): Promise<MenuNode[]> {
  // TODO: 替换为真实 API 调用
  // const response = await fetch('/api/menus', {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${getToken()}`
  //   }
  // })
  //
  // if (!response.ok) {
  //   throw new Error(`HTTP error! status: ${response.status}`)
  // }
  //
  // return await response.json()

  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 500))

  // 模拟返回空数组（表示后端暂无数据）
  return []
}

/**
 * 创建菜单节点
 * @param node 要创建的菜单节点
 * @returns 创建后的节点（包含服务端生成的 ID）
 */
export async function createMenu(node: Omit<MenuNode, 'id'>): Promise<MenuNode> {
  // TODO: 替换为真实 API 调用
  // const response = await fetch('/api/menus', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${getToken()}`
  //   },
  //   body: JSON.stringify(node)
  // })
  //
  // if (!response.ok) {
  //   throw new Error(`HTTP error! status: ${response.status}`)
  // }
  //
  // return await response.json()

  await new Promise((resolve) => setTimeout(resolve, 300))

  // 模拟创建成功，返回带 ID 的节点
  return {
    ...node,
    id: `server-${Date.now()}`,
  } as MenuNode
}

/**
 * 更新菜单节点
 * @param id 节点 ID
 * @param node 更新的数据
 * @returns 更新后的节点
 */
export async function updateMenu(id: string, node: Partial<MenuNode>): Promise<MenuNode> {
  // TODO: 替换为真实 API 调用
  // const response = await fetch(`/api/menus/${id}`, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${getToken()}`
  //   },
  //   body: JSON.stringify(node)
  // })
  //
  // if (!response.ok) {
  //   throw new Error(`HTTP error! status: ${response.status}`)
  // }
  //
  // return await response.json()

  await new Promise((resolve) => setTimeout(resolve, 300))

  // 模拟更新成功
  return {
    id,
    ...node,
  } as MenuNode
}

/**
 * 删除菜单节点
 * @param id 节点 ID
 * @returns 是否删除成功
 */
export async function deleteMenu(_id: string): Promise<boolean> {
  // TODO: 替换为真实 API 调用
  // const response = await fetch(`/api/menus/${_id}`, {
  //   method: 'DELETE',
  //   headers: {
  //     'Authorization': `Bearer ${getToken()}`
  //   }
  // })
  //
  // if (!response.ok) {
  //   throw new Error(`HTTP error! status: ${response.status}`)
  // }
  //
  // return response.status === 200 || response.status === 204

  await new Promise((resolve) => setTimeout(resolve, 300))

  // 模拟删除成功
  return true
}

/**
 * 批量删除菜单节点
 * @param ids 节点 ID 数组
 * @returns 删除成功的数量
 */
export async function batchDeleteMenus(ids: string[]): Promise<number> {
  // TODO: 替换为真实 API 调用
  // const response = await fetch('/api/menus/batch-delete', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${getToken()}`
  //   },
  //   body: JSON.stringify({ ids })
  // })
  //
  // if (!response.ok) {
  //   throw new Error(`HTTP error! status: ${response.status}`)
  // }
  //
  // const result = await response.json()
  // return result.deletedCount

  await new Promise((resolve) => setTimeout(resolve, 500))

  // 模拟批量删除成功
  return ids.length
}

/**
 * 导入菜单数据
 * @param menus 要导入的菜单数组
 * @returns 导入结果
 */
export async function importMenus(menus: MenuNode[]): Promise<{ success: number; failed: number }> {
  // TODO: 替换为真实 API 调用
  // const response = await fetch('/api/menus/import', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${getToken()}`
  //   },
  //   body: JSON.stringify({ menus })
  // })
  //
  // if (!response.ok) {
  //   throw new Error(`HTTP error! status: ${response.status}`)
  // }
  //
  // return await response.json()

  await new Promise((resolve) => setTimeout(resolve, 800))

  // 模拟导入成功
  return {
    success: menus.length,
    failed: 0,
  }
}

/**
 * 导出菜单数据
 * @returns 菜单数据
 */
export async function exportMenus(): Promise<MenuNode[]> {
  // TODO: 替换为真实 API 调用
  // const response = await fetch('/api/menus/export', {
  //   method: 'GET',
  //   headers: {
  //     'Authorization': `Bearer ${getToken()}`
  //   }
  // })
  //
  // if (!response.ok) {
  //   throw new Error(`HTTP error! status: ${response.status}`)
  // }
  //
  // return await response.json()

  await new Promise((resolve) => setTimeout(resolve, 500))

  // 模拟导出（返回空数组）
  return []
}
