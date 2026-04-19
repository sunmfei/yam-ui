/**
 * Types 统一导出
 *
 * 目录结构：
 * - constants/ : 常量定义
 * - enums/     : 枚举类型
 * - models/    : 数据模型、接口和类
 */

// ==================== Constants ====================
export { LocalCacheKey, SystemCacheKey } from './constants/CacheKeys'
export type { LocalCacheKeyType, SystemCacheKeyType } from './constants/CacheKeys'

export { MenuType, MenuActionKey } from './constants/MenuConstants'
export type { MenuNodeType, MenuActionKeyType } from './constants/MenuConstants'

export { RouteSource } from './constants/RouteConstants'
export type { RouteSourceType } from './constants/RouteConstants'

// ==================== Enums ====================
export type { BackgroundType } from './enums/BackgroundType'

// ==================== Models ====================
export type { ActionHandler, GetterHandler } from './models/ActionHandlers'
export { actionHub, default } from './models/ActionHub'

export type { CacheOptions, CacheItem } from './models/CacheModels'

export type { MenuNode } from './models/MenuNode'
export type { PanelSection } from './models/PanelSection.type'

export type {
  AppRouteMeta,
  AppRoute,
  FrontendRoute,
  BackendRoute,
  MergedRoute,
  RouteTreeNode,
} from './models/RouteModels'

export { BACKGROUND_OPTIONS, type BackgroundOption } from './models/UiModels'
