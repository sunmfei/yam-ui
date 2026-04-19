/**
 * 菜单类型常量
 */
export const MenuType = {
  ACTION: 'action',
  ROUTE: 'route',
  MENU: 'menu',
  SELECT: 'select',
  OPTION: 'option',
} as const

export type MenuNodeType = (typeof MenuType)[keyof typeof MenuType]

/**
 * 菜单 Action 键常量
 */
export const MenuActionKey = {
  TOGGLE_THEME: 'menu-toggle-theme',
  RESET_MENU: 'menu-reset-menu',
  CHANGE_BG: 'menu-change-background',
  GET_BG: 'menu-get-current-background',
  GET_ICON: 'menu-get-icon',
} as const

export type MenuActionKeyType = (typeof MenuActionKey)[keyof typeof MenuActionKey]
