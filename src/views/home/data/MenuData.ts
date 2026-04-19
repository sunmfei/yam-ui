import { ICON_POOL } from '@/config/types/icon.pool.ts'
import { MenuActionKey, type MenuNode, MenuType } from '@/types'
import { BACKGROUND_OPTIONS } from '@/types'
import { CacheActionKey } from '@/actions/cache.action.ts'

export const DEFAULT_MENU: MenuNode[] = [
  {
    id: 'MFei',
    name: 'MFei',
    type: MenuType.ROUTE,
    icon: ICON_POOL.Home,
    path: '/',
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
    name: '设置',
    type: MenuType.MENU,
    icon: ICON_POOL.Settings,
    order: 2,
    children: [
      {
        id: 'cache-config',
        name: '缓存配置',
        type: MenuType.SELECT,
        icon: ICON_POOL.Menu,
        order: 0,
        children: [
          {
            id: 'cache-config-local',
            name: '本地缓存',
            type: MenuType.ACTION,
            icon: ICON_POOL.Menu,
            actionKey: CacheActionKey.CLEAR_LOCAL,
          },
          {
            id: 'cache-config-system',
            name: '系统缓存',
            type: MenuType.ACTION,
            icon: ICON_POOL.Menu,
            actionKey: CacheActionKey.CLEAR_SYSTEM,
          },
        ],
      },
      {
        id: 'menu-config',
        name: '菜单配置',
        type: MenuType.ROUTE,
        icon: ICON_POOL.Menu,
        path: '/menu-config',
      },
      {
        id: 'reset-menu',
        name: '重置菜单',
        type: MenuType.ACTION,
        icon: ICON_POOL.RefreshCw,
        actionKey: MenuActionKey.RESET_MENU,
        meta: { divided: true },
      },
    ],
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
