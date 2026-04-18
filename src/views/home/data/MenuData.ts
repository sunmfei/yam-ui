import type { MenuNode } from '@/types/menu'
import { BACKGROUND_OPTIONS } from '@/types/background.ts'
import { ICON_POOL } from '@/config/types/icon.pool.ts'

/**
 * 默认菜单（纯数据版）
 *
 * ⚠️ 规则：
 * - 不允许任何 function
 * - 不允许 store 调用
 * - 不允许业务逻辑
 * - 只允许 key + data
 */
export const DEFAULT_MENU: MenuNode[] = [
  {
    id: 'MFei',
    name: 'MFei',
    type: 'route',
    icon: ICON_POOL.Moon, // 默认图标（fallback）
    path: '/tree-table-demo', // 跳转到首页
    order: 0,
  },
  {
    id: 'theme',
    name: '主题切换',
    type: 'button',
    icon: ICON_POOL.Moon, // 默认图标（fallback）
    getIconKey: 'menu-get-icon', // 动态获取
    actionKey: 'menu-toggle-theme',
    order: 1,
  },

  {
    id: 'settings',
    name: '设置',
    type: 'dropdown',
    icon: ICON_POOL.Settings,
    order: 2,
    children: [
      {
        id: 'menu-config',
        name: '菜单配置',
        type: 'route',
        icon: 'Menu',
        path: '/menu-config',
        order: 1,
      },
      {
        id: 'reset-menu',
        name: '重置菜单',
        type: 'button',
        icon: ICON_POOL.RefreshCw,
        actionKey: 'menu-reset-menu',
        order: 2,
        meta: {
          divided: true,
        },
      },
    ],
  },

  {
    id: 'background',
    name: '背景选择',
    type: 'list',
    icon: ICON_POOL.Palette,
    order: 3,

    children: BACKGROUND_OPTIONS.map((item) => ({
      id: String(item.value),
      name: item.label,
      type: 'list-item',
      value: item.value,
      icon: '',
    })),

    onItemClickKey: 'menu-change-background',
    getSelectedLabelKey: 'menu-get-current-background',
  },
]
