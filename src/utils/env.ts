/**
 * 环境变量验证
 * 在应用启动时检查必需的环境变量是否存在
 */

interface EnvConfig {
  required: string[]
  optional: string[]
}

const envConfig: EnvConfig = {
  required: ['VITE_API_BASE_URL', 'VITE_APP_TITLE', 'VITE_APP_VERSION'],
  optional: [
    'VITE_ENABLE_MOCK',
    'VITE_DEBUG',
    'VITE_LOG_LEVEL',
    'VITE_CDN_URL',
    'VITE_SENTRY_DSN',
    'VITE_ANALYTICS_ID',
  ],
}

/**
 * 验证环境变量
 */
export function validateEnv() {
  const missing: string[] = []
  const warnings: string[] = []

  // 检查必需的变量
  envConfig.required.forEach((key) => {
    if (!import.meta.env[key]) {
      missing.push(key)
    }
  })

  // 检查可选变量的格式
  if (import.meta.env.VITE_API_BASE_URL) {
    try {
      new URL(import.meta.env.VITE_API_BASE_URL)
    } catch {
      warnings.push(`VITE_API_BASE_URL "${import.meta.env.VITE_API_BASE_URL}" is not a valid URL`)
    }
  }

  // 输出错误和警告
  if (missing.length > 0) {
    console.error(
      '[Env Validation Error] Missing required environment variables:',
      missing.join(', ')
    )
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  if (warnings.length > 0) {
    console.warn('[Env Validation Warning]', warnings.join('\n'))
  }

  // 开发环境下打印环境变量信息
  if (import.meta.env.DEV) {
    console.log('[Environment]', {
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV,
      prod: import.meta.env.PROD,
      version: import.meta.env.VITE_APP_VERSION,
      baseUrl: import.meta.env.VITE_API_BASE_URL,
      appTitle: import.meta.env.VITE_APP_TITLE,
      debug: getEnvBoolean('VITE_DEBUG', false),
      logLevel: getEnv('VITE_LOG_LEVEL', 'info'),
    })
  }
}

/**
 * 获取环境变量（带默认值）
 */
export function getEnv(key: string, defaultValue: string = ''): string {
  return import.meta.env[key] || defaultValue
}

/**
 * 获取布尔类型的环境变量
 */
export function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = import.meta.env[key]
  if (value === undefined) {
    return defaultValue
  }
  return value === 'true' || value === '1'
}

/**
 * 获取数字类型的环境变量
 */
export function getEnvNumber(key: string, defaultValue: number = 0): number {
  const value = import.meta.env[key]
  if (value === undefined) {
    return defaultValue
  }
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}
