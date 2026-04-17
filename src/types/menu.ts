/**
 * 菜单动作 Key 统一管理
 */
export const MenuActionKey = {
  MENU_TOGGLE_THEME: 'menu-toggle-theme',
  MENU_RESET_MENU: 'menu-reset-menu',
  MENU_CHANGE_BACKGROUND: 'menu-change-background',
  MENU_GET_CURRENT_BACKGROUND: 'menu-get-current-background',
  MENU_GET_ICON: 'menu-get-icon',
} as const

export type MenuActionKey = (typeof MenuActionKey)[keyof typeof MenuActionKey]

export type MenuNodeType = 'button' | 'route' | 'dropdown' | 'list' | 'list-item'

/**
 * 菜单节点（最终推荐版）
 *
 * 核心原则：
 * ❗所有行为必须通过 key 解析
 */
export interface MenuNode {
  /** 唯一ID */
  id: string

  /** 菜单名称 */
  name: string

  /** 类型 */
  type: MenuNodeType

  /** 图标（必须纯字符串） */
  icon?: string

  /** 动态获取图标Key */
  getIconKey?: string

  /** 路由 */
  path?: string

  /** 行为Key（核心） */
  actionKey?: string

  /** 列表项点击Key */
  onItemClickKey?: string

  /** 获取选中标签Key */
  getSelectedLabelKey?: string

  /** list-item 值 */
  value?: string | number

  /** 状态 */
  hidden?: boolean
  disabled?: boolean
  order?: number

  /** 扩展 */
  meta?: Record<string, unknown>

  /** 子节点 */
  children?: MenuNode[]

  /** 索引签名，允许兼容 TreeTableRow 等通用类型 */
  [key: string]: unknown
}
