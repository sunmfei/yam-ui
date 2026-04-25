import { useAppStore, useUserStore } from '@/stores'
import menuConfig from '@/utils/menu/MenuUtils.ts'
import { BACKGROUND_OPTIONS } from '@/types'
import actionHub from '@/types'
import { ICON_POOL } from '@/config/types/icon.pool.ts'
import { MenuActionKey } from '@/types'
import type { Router } from 'vue-router'

/**
 * 初始化菜单动作注册
 * 在应用启动时调用
 */
export default function initMenuActions(router: Router) {
  const appStore = useAppStore()
  const userStore = useUserStore()
  console.log('initMenuActions')

  actionHub.registerAction(MenuActionKey.TOGGLE_THEME, async () => {
    appStore.toggleTheme()
  })

  actionHub.registerAction(MenuActionKey.RESET_MENU, async () => {
    menuConfig.resetToDefault()
  })

  actionHub.registerAction(MenuActionKey.CHANGE_BG, async (item: unknown) => {
    const payload = item as { value?: string }
    if (payload?.value) {
      appStore.setBackgroundType(payload.value as any)
    }
  })

  actionHub.registerGetter(
    MenuActionKey.GET_BG,
    () =>
      BACKGROUND_OPTIONS.find((item) => item.value === appStore.backgroundType)?.label ?? '背景选择'
  )

  /**
   *
   * 获取主题图标（动态）
   */
  actionHub.registerGetter(MenuActionKey.GET_ICON, () => {
    console.log('MenuActionKey.GET_ICON')
    return appStore.isDark ? ICON_POOL.Moon : ICON_POOL.Sun
  })

  /**
   * 认证操作（登录/退出）
   */
  actionHub.registerAction(MenuActionKey.AUTH_ACTION, async () => {
    if (userStore.isLoggedIn) {
      await userStore.logout({ redirectToLogin: false, callApi: true })
      await router.push('/')
      return
    }

    await router.push('/login')
  })
}
