import type { NavigationItem } from '@/components/modules/navigation/data/navigation.data'

/**
 * 导航管理 API
 *
 * TODO: 后期替换为真实的后端接口调用
 * 当前使用模拟数据用于开发和测试
 */

/**
 * 获取所有导航数据
 * @returns 导航项数组
 */
export async function getNavigations(): Promise<NavigationItem[]> {
  // TODO: 替换为真实 API 调用
  await new Promise((resolve) => setTimeout(resolve, 500))

  // 模拟返回空数组（表示后端暂无数据）
  return []
}

/**
 * 创建导航项
 * @param item 要创建的导航项
 * @returns 创建后的项（包含服务端生成的 ID）
 */
export async function createNavigation(item: Omit<NavigationItem, 'id'>): Promise<NavigationItem> {
  // TODO: 替换为真实 API 调用
  await new Promise((resolve) => setTimeout(resolve, 300))

  // 模拟创建成功，返回带 ID 的项
  return {
    ...item,
    id: `server-${Date.now()}`,
  } as NavigationItem
}

/**
 * 更新导航项
 * @param id 项 ID
 * @param item 更新的数据
 * @returns 更新后的项
 */
export async function updateNavigation(
  id: string,
  item: Partial<NavigationItem>
): Promise<NavigationItem> {
  // TODO: 替换为真实 API 调用
  await new Promise((resolve) => setTimeout(resolve, 300))

  // 模拟更新成功
  return {
    id,
    ...item,
  } as NavigationItem
}

/**
 * 删除导航项
 * @param id 项 ID
 * @returns 是否删除成功
 */
export async function deleteNavigation(_id: string): Promise<boolean> {
  // TODO: 替换为真实 API 调用
  await new Promise((resolve) => setTimeout(resolve, 300))

  // 模拟删除成功
  return true
}

/**
 * 批量删除导航项
 * @param ids 项 ID 数组
 * @returns 删除成功的数量
 */
export async function batchDeleteNavigations(ids: string[]): Promise<number> {
  // TODO: 替换为真实 API 调用
  await new Promise((resolve) => setTimeout(resolve, 500))

  // 模拟批量删除成功
  return ids.length
}

/**
 * 导入导航数据
 * @param items 要导入的导航项数组
 * @returns 导入结果
 */
export async function importNavigations(
  items: NavigationItem[]
): Promise<{ success: number; failed: number }> {
  // TODO: 替换为真实 API 调用
  await new Promise((resolve) => setTimeout(resolve, 800))

  // 模拟导入成功
  return {
    success: items.length,
    failed: 0,
  }
}

/**
 * 导出导航数据
 * @returns 导航数据
 */
export async function exportNavigations(): Promise<NavigationItem[]> {
  // TODO: 替换为真实 API 调用
  await new Promise((resolve) => setTimeout(resolve, 500))

  // 模拟导出（返回空数组）
  return []
}
