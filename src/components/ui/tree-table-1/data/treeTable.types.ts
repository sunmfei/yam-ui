/**
 * ================================
 * 类型定义（所有核心结构）
 * ================================
 */

export interface TreeColumn {
  key: string
  title: string
  width?: string
  align?: 'left' | 'center' | 'right'
  slot?: string
}

export interface TreeNode {
  [key: string]: unknown
  children?: TreeNode[]
  hasChildren?: boolean
  loading?: boolean
}

export interface UseTreeTableOptions {
  rowKey: string
}
