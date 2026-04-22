import type { TreeTableColumn } from '@/components/ui/tree-table/types'
import { getCategoryName } from './category.dict'

/**
 * 导航管理表格列配置（扁平结构）
 */
export const navigationColumns: TreeTableColumn[] = [
  { key: 'title', title: '标题', slot: 'title', width: '20%' },
  { key: 'icon', title: '图标', slot: 'icon', width: '8%', align: 'center' },
  { key: 'url', title: 'URL', slot: 'url', width: '30%' },
  { key: 'category', title: '分类', slot: 'category', width: '15%' },
  { key: 'order', title: '排序', width: '8%', align: 'center' },
  { key: 'actions', title: '操作', slot: 'actions', width: '19%', align: 'right' },
]

/**
 * 表头操作按钮配置（已在 index.vue 中直接使用）
 */
export const headerActions = [
  { label: '刷新', key: 'refresh', variant: 'outline' as const },
  { label: '重置', key: 'reset', variant: 'default' as const },
  { label: '导入', key: 'import', variant: 'default' as const, icon: 'Upload' },
  { label: '导出', key: 'export', variant: 'default' as const },
  { label: '批量删除', key: 'batchDelete', variant: 'destructive' as const },
  { label: '添加导航', key: 'addRoot', variant: 'default' as const },
]

/**
 * 获取分类显示名称
 */
export function formatCategory(code: string): string {
  return getCategoryName(code)
}
