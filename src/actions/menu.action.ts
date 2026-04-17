import { useAppStore } from '@/stores/app'
import menuConfig from '@/utils/menu/MenuUtils.ts'
import { MenuActionKey } from '@/types/menu.ts'
import { BACKGROUND_OPTIONS } from '@/types/background.ts'
import actionHub from '@/types/ActionHub.ts'

/**
 * 初始化菜单动作注册
 * 在应用启动时调用
 */
export default function initMenuActions() {
  const appStore = useAppStore()
  console.log('initMenuActions')

  actionHub.registerAction(MenuActionKey.MENU_TOGGLE_THEME, async () => {
    appStore.toggleTheme()
  })

  actionHub.registerAction(MenuActionKey.MENU_RESET_MENU, async () => {
    menuConfig.resetToDefault()
  })

  actionHub.registerAction(MenuActionKey.MENU_CHANGE_BACKGROUND, async (item: any) => {
    if (item?.value) {
      appStore.setBackgroundType(item.value)
    }
  })

  actionHub.registerGetter(
    MenuActionKey.MENU_GET_CURRENT_BACKGROUND,
    () =>
      BACKGROUND_OPTIONS.find((item) => item.value === appStore.backgroundType)?.label ?? '背景选择'
  )

  /**
   * 获取主题图标（动态）
   */
  actionHub.registerGetter(MenuActionKey.MENU_GET_ICON, () => {
    console.log('MenuActionKey.MENU_GET_ICON')
    return appStore.isDark ? 'Moon' : 'Sunny'
  })
}
