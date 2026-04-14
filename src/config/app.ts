/**
 * 应用配置常量
 * 从环境变量读取并提供默认值
 */

import { getEnv, getEnvBoolean } from '@/utils/env'

// 基础配置
export const APP_CONFIG = {
  // 应用信息
  VERSION: import.meta.env.VITE_APP_VERSION || '0.0.0',
  TITLE: import.meta.env.VITE_APP_TITLE || 'Yam UI',

  // API 配置
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',

  // 功能开关
  DEBUG: getEnvBoolean('VITE_DEBUG', false),
  ENABLE_MOCK: getEnvBoolean('VITE_ENABLE_MOCK', false),

  // 日志级别
  LOG_LEVEL: getEnv('VITE_LOG_LEVEL', 'info'),

  // 第三方服务
  CDN_URL: getEnv('VITE_CDN_URL', ''),
  SENTRY_DSN: getEnv('VITE_SENTRY_DSN', ''),
  ANALYTICS_ID: getEnv('VITE_ANALYTICS_ID', ''),
} as const

// 环境判断
export const ENV = {
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  MODE: import.meta.env.MODE,
  BASE_URL: import.meta.env.BASE_URL,
} as const

// 根据环境导出不同的配置
export const isDev = ENV.DEV
export const isProd = ENV.PROD
export const isTest = ENV.MODE === 'test'
export const isStaging = ENV.MODE === 'staging'
