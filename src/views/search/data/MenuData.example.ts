/**
 * 菜单配置使用示例
 */

import type { MenuItem } from '@/types/menu'
import { menuConfig } from '@/views/search/data/MenuData.ts'

/**
 * 示例1: 获取合并后的菜单数据
 */
export async function example1_getMergedMenu() {
  const menu = await menuConfig.getMergedMenu()
  console.log('合并后的菜单:', menu)
  return menu
}

/**
 * 示例2: 获取静态菜单
 */
export function example2_getStaticMenu() {
  const menu = menuConfig.getStaticMenu()
  console.log('静态菜单:', menu)
  return menu
}

/**
 * 示例3: 保存用户自定义菜单
 */
export function example3_saveUserMenu() {
  const customMenu: MenuItem[] = [
    {
      name: '我的工作台',
      icon: 'home',
      path: '/workspace',
      order: 1,
    },
    {
      name: '数据分析',
      icon: 'chart',
      path: '/analytics',
      order: 2,
      children: [
        {
          name: '实时数据',
          path: '/analytics/realtime',
        },
        {
          name: '历史数据',
          path: '/analytics/history',
        },
      ],
    },
  ]

  menuConfig.saveUserMenu(customMenu)
  console.log('✓ 已保存自定义菜单')
}

/**
 * 示例4: 从后端获取菜单（待实现接口）
 */
export async function example4_fetchApiMenu() {
  const menu = await menuConfig.fetchApiMenu()
  console.log('后端菜单:', menu)
  return menu
}

/**
 * 示例5: 清除用户自定义菜单，恢复默认
 */
export function example5_resetToDefault() {
  menuConfig.resetToDefault()
  console.log('✓ 已重置为默认菜单')
}

/**
 * 示例6: 在 Vue 组件中使用
 */
export function example6_vueComponentUsage() {
  // 在 setup 中:
  /*
  import { ref, onMounted } from 'vue'
  import { menuConfig } from '@/views/search/data/MenuData'

  const menuList = ref<MenuNode[]>([])

  onMounted(async () => {
    // 自动根据优先级获取菜单
    menuList.value = await menuConfig.getMergedMenu()
  })

  // 保存用户自定义
  function saveCustomMenu() {
    menuConfig.saveUserMenu(menuList.value)
  }

  // 重置为默认
  function resetMenu() {
    menuConfig.resetToDefault()
    menuList.value = menuConfig.getStaticMenu()
  }
  */
}
