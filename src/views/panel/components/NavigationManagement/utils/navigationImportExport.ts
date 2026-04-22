/**
 * navigationImportExport - 菜单导入导出工具
 */
import type { NavigationItem } from '@/components/modules/navigation/data/navigation.data'
import { SunMessage } from '@/utils/message'

/**
 * 导出菜单数据为 JSON 文件
 */
export function exportNavigationData(navigations: NavigationItem[]) {
  const blob = new Blob([JSON.stringify(navigations, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `navigation-tree-${Date.now()}.json`
  link.click()
  URL.revokeObjectURL(url)
  SunMessage.success('导出完成')
}

/**
 * 验证导航数据结构（扁平结构）
 */
export function validateNavigationData(data: unknown[]): void {
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    if (typeof item !== 'object' || item === null) {
      throw new Error(`第 ${i + 1} 个节点格式错误`)
    }
    const node = item as Record<string, unknown>
    if (!node.id || !node.title || !node.url || !node.category) {
      throw new Error(`第 ${i + 1} 个节点缺少必要字段（id、title、url、category）`)
    }
  }
}

/**
 * 从文件导入菜单数据
 */
export async function importNavigationData(file: File): Promise<NavigationItem[]> {
  try {
    const text = await file.text()
    const data = JSON.parse(text)

    if (!Array.isArray(data)) {
      throw new Error('文件格式错误：必须是数组格式')
    }

    validateNavigationData(data)
    return data
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知错误'
    throw new Error(`导入失败：${message}`, { cause: error })
  }
}
