import actionHub from '@/types'
import { localCache } from '@/utils/cache/localCache.ts'
import { systemCache } from '@/utils/cache'
import { SunMessage } from '@/utils/message.ts'

export const CacheActionKey = {
  CLEAR_ALL: 'cache_clear_all',
  CLEAR_LOCAL: 'cache_clear_local',
  CLEAR_SYSTEM: 'cache_clear_system',
} as const
export type CacheActionKey = (typeof CacheActionKey)[keyof typeof CacheActionKey]

/**
 * 初始化菜单动作注册
 * 在应用启动时调用
 */
export default function initCacheActions() {
  console.log('initCacheActions')
  actionHub.registerAction(CacheActionKey.CLEAR_LOCAL, async () => {
    localCache.clearAll()
    SunMessage.success('本地缓存已清空')
  })

  actionHub.registerAction(CacheActionKey.CLEAR_SYSTEM, async () => {
    systemCache.clearAll()
    SunMessage.success('系统缓存已清空')
  })
  actionHub.registerAction(CacheActionKey.CLEAR_ALL, async () => {
    localCache.clearAll()
    systemCache.clearAll()
    SunMessage.success('所有缓存已清空')
  })
}
