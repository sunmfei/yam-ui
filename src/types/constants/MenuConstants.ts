/**
 * 菜单相关常量
 */

/**
 * 菜单节点类型
 */
export const MenuType = {
  /** 动作类型：点击执行预设动作 */
  ACTION: 'action',
  /** 路由类型：点击跳转到指定路由 */
  ROUTE: 'route',
  /** 菜单类型：包含子菜单项的下拉菜单 */
  MENU: 'menu',
  /** 选择器类型：列表选择器 */
  SELECT: 'select',
  /** @deprecated 选项类型：选择器的子项 */
  OPTION: 'option',
} as const

export type MenuNodeType = (typeof MenuType)[keyof typeof MenuType]

/**
 * 菜单动作键名常量
 */
export const MenuActionKey = {
  /** 切换主题 */
  TOGGLE_THEME: 'menu-toggle-theme',
  /** 重置菜单 */
  RESET_MENU: 'menu-reset-menu',
  /** 更改背景 */
  CHANGE_BG: 'menu-change-background',
  /** 获取当前背景 */
  GET_BG: 'menu-get-current-background',
  /** 获取图标 */
  GET_ICON: 'menu-get-icon',
  AUTH_ACTION: 'menu-auth-action',
} as const

export type MenuActionKeyType = (typeof MenuActionKey)[keyof typeof MenuActionKey]
