/**
 * 工具函数统一导出
 */

// HTTP 请求
export { http, default as request } from './request'

// 错误处理
export { setupErrorHandler } from './errorHandler'

// 环境变量
export { validateEnv, getEnv, getEnvBoolean, getEnvNumber } from './env'

// 预加载
export {
  preloadRoute,
  preloadRoutes,
  smartPreload,
  preconnect,
  prefetch,
  preloadResource,
} from './preload'
