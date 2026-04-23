/**
 * 导航分类字典配置
 *
 * 功能：定义导航分类的映射关系
 * 结果：提供分类显示名称和图标
 * 设计目的：统一管理分类配置，支持后端动态获取
 */

export interface CategoryDict {
  /** 分类代码（存储值） */
  code: string
  /** 分类名称（显示值） */
  name: string
  /** 分类图标 */
  icon?: string
  /** 排序 */
  order?: number
}

/**
 * 默认分类字典（临时使用常量，后续从后端获取）
 */
export const DEFAULT_CATEGORY_DICT: CategoryDict[] = [
  {
    code: 'sit',
    name: 'sit导航',
    icon: 'Search',
    order: 1,
  },
  {
    code: 'system',
    name: '系统导航',
    icon: 'Code',
    order: 2,
  },
  {
    code: '其他',
    name: '其他',
    icon: 'MoreHorizontal',
    order: 99,
  },
]

/**
 * 根据分类代码获取分类信息
 */
export function getCategoryByCode(code: string): CategoryDict | undefined {
  return DEFAULT_CATEGORY_DICT.find((item) => item.code === code)
}

/**
 * 获取所有分类列表（按排序）
 */
export function getAllCategories(): CategoryDict[] {
  return [...DEFAULT_CATEGORY_DICT].sort((a, b) => (a.order || 0) - (b.order || 0))
}

/**
 * 获取分类名称
 */
export function getCategoryName(code: string): string {
  return getCategoryByCode(code)?.name || code
}

/**
 * 获取分类图标
 */
export function getCategoryIcon(code: string): string | undefined {
  return getCategoryByCode(code)?.icon
}
