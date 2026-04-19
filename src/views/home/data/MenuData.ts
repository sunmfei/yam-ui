import { ICON_POOL } from '@/config/types/icon.pool.ts'
import { type MenuNode, MenuType } from '@/types'
import { BACKGROUND_OPTIONS } from '@/types'

export const DEFAULT_MENU: MenuNode[] = [
  {
    id: 'MFei',
    name: 'MFei',
    type: MenuType.ROUTE,
    icon: ICON_POOL.Home,
    path: '/demoRouter',
    order: 0,
  },

  {
    id: 'theme',
    name: '主题切换',
    type: MenuType.ACTION,
    icon: ICON_POOL.Moon,
    getIconKey: 'menu-get-icon',
    actionKey: 'menu-toggle-theme',
    order: 1,
  },

  {
    id: 'settings',
    name: '管理',
    type: MenuType.ROUTE,
    icon: ICON_POOL.Settings,
    path: '/admin',
    order: 2,
  },

  {
    id: 'background',
    name: '背景选择',
    type: MenuType.SELECT,
    icon: ICON_POOL.Palette,
    order: 3,

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
