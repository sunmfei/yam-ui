/**
 * 本地缓存键名（用户行为数据）
 * 所有本地缓存 key 必须以 'local_' 开头
 */
export const LocalCacheKey = {
  THEME: 'local_theme', // 主题偏好
  LANGUAGE: 'local_language', // 语言设置
  BACKGROUND_TYPE: 'local_backgroundType', // 背景类型
  SEARCH_HISTORY: 'local_searchHistory', // 搜索历史
  USER_PREFERENCES: 'local_userPreferences', // 用户偏好
  MENU_CONFIG: 'local_menu_data', // 用户自定义菜单配置
} as const

export type LocalCacheKeyType = (typeof LocalCacheKey)[keyof typeof LocalCacheKey]

/**
 * 系统缓存键名（服务器数据）
 * 所有系统缓存 key 必须以 'sys_' 开头
 */
export const SystemCacheKey = {
  USER_INFO: 'sys_userInfo', // 用户信息
  TOKEN: 'sys_token', // 认证令牌
  API_DATA: 'sys_apiData', // API 响应数据
  CONFIG: 'sys_config', // 系统配置
  DICTIONARY: 'sys_dictionary', // 字典数据
  MENU_DATA: 'sys_menuData', // 后端菜单数据
} as const

export type SystemCacheKeyType = (typeof SystemCacheKey)[keyof typeof SystemCacheKey]
