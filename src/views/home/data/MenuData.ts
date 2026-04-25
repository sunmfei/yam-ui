import { ICON_POOL } from '@/config/types/icon.pool.ts'
import { MenuActionKey, type MenuNode, MenuType } from '@/types'
import { BACKGROUND_OPTIONS } from '@/types'

/**
 * 获取默认菜单配置（动态生成，支持响应式更新）
 */
export function getDefaultMenu(): MenuNode[] {
  return [
    {
      id: 'auth',
      name: '登录',
      type: MenuType.ACTION,
      icon: 'LogIn',
      actionKey: MenuActionKey.AUTH_ACTION,
      order: 0,
      position: 'right',
    },

    {
      id: 'theme',
      name: '主题切换',
      type: MenuType.ACTION,
      icon: ICON_POOL.Moon,
      getIconKey: 'menu-get-icon',
      actionKey: 'menu-toggle-theme',
      order: 1,
      position: 'left',
    },

    {
      id: 'settings',
      name: '管理',
      type: MenuType.ROUTE,
      icon: ICON_POOL.Settings,
      path: '/admin',
      order: 2,
      position: 'left',
    },

    {
      id: 'background',
      name: '背景选择',
      type: MenuType.SELECT,
      icon: ICON_POOL.Palette,
      order: 3,
      position: 'left',

      children: BACKGROUND_OPTIONS.map((item) => ({
        id: String(item.value),
        name: item.label,
        type: 'option',
        value: item.value,
      })),

      onChangeKey: 'menu-change-background',
      getValueKey: 'menu-get-current-background',
    },
  ]
}
