/**
 * menuImportExport - 菜单导入导出工具
 */
import type { MenuNode } from '@/types'
import { SunMessage } from '@/utils/message'

/**
 * 导出菜单数据为 JSON 文件
 */
export function exportMenuData(menus: MenuNode[]) {
  const blob = new Blob([JSON.stringify(menus, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `menu-tree-${Date.now()}.json`
  link.click()
  URL.revokeObjectURL(url)
  SunMessage.success('导出完成')
}

/**
 * 验证菜单数据结构
 */
export function validateMenuData(data: unknown[]): void {
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    if (typeof item !== 'object' || item === null) {
      throw new Error(`第 ${i + 1} 个节点格式错误`)
    }
    const node = item as Record<string, unknown>
    if (!node.id || !node.name || !node.type) {
      throw new Error(`第 ${i + 1} 个节点缺少必要字段（id、name、type）`)
    }
    if (node.children && Array.isArray(node.children)) {
      validateMenuData(node.children as unknown[])
    }
  }
}

/**
 * 从文件导入菜单数据
 */
export async function importMenuData(file: File): Promise<MenuNode[]> {
  try {
    const text = await file.text()
    const data = JSON.parse(text)

    if (!Array.isArray(data)) {
      throw new Error('文件格式错误：必须是数组格式')
    }

    validateMenuData(data)
    return data
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知错误'
    throw new Error(`导入失败：${message}`, { cause: error })
  }
}
