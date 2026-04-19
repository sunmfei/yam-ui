/**
 * 缓存键名常量
 */
export const LocalCacheKey = {
  THEME: 'local_theme',
  LANGUAGE: 'local_language',
  BACKGROUND_TYPE: 'local_backgroundType',
  SEARCH_HISTORY: 'local_searchHistory',
  USER_PREFERENCES: 'local_userPreferences',
  MENU_CONFIG: 'local_menu_data',
} as const

export type LocalCacheKeyType = (typeof LocalCacheKey)[keyof typeof LocalCacheKey]

export const SystemCacheKey = {
  USER_INFO: 'sys_userInfo',
  TOKEN: 'sys_token',
  API_DATA: 'sys_apiData',
  CONFIG: 'sys_config',
  DICTIONARY: 'sys_dictionary',
  MENU_DATA: 'sys_menuData',
} as const

export type SystemCacheKeyType = (typeof SystemCacheKey)[keyof typeof SystemCacheKey]
