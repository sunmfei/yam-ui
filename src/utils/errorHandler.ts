import type { App } from 'vue'

/**
 * 全局错误处理
 */
export function setupErrorHandler(app: App) {
  // Vue 错误处理
  app.config.errorHandler = (err, instance, info) => {
    console.error('[Vue Error]', {
      error: err,
      component: instance,
      info,
    })

    // 生产环境下可以上报到错误监控平台
    if (import.meta.env.PROD) {
      reportError(err, {
        type: 'vue',
        component: instance?.$options?.name,
        info,
      })
    }
  }

  // 未捕获的 Promise 错误
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[Unhandled Rejection]', event.reason)

    if (import.meta.env.PROD) {
      reportError(event.reason, {
        type: 'unhandledrejection',
      })
    }

    // 防止控制台打印重复错误
    event.preventDefault()
  })

  // 全局 JavaScript 错误
  window.addEventListener('error', (event) => {
    console.error('[Global Error]', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
    })

    if (import.meta.env.PROD) {
      reportError(event.error || event.message, {
        type: 'global',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    }
  })

  // 资源加载错误
  window.addEventListener(
    'error',
    (event) => {
      const target = event.target as HTMLElement | null

      // 忽略冒泡的全局错误或无效目标
      if (!target || !target.tagName) {
        return
      }

      console.error('[Resource Load Error]', {
        tagName: target.tagName,
        src: (target as HTMLImageElement).src || (target as HTMLLinkElement).href,
      })

      if (import.meta.env.PROD) {
        reportError(new Error('Resource load failed'), {
          type: 'resource',
          tagName: target.tagName,
          src: (target as HTMLImageElement).src || (target as HTMLLinkElement).href,
        })
      }
    },
    true // 使用捕获阶段
  )
}

/**
 * 上报错误到监控平台
 */
function reportError(error: unknown, context: Record<string, unknown>) {
  // TODO: 集成错误监控平台（如 Sentry、Fundebug 等）
  // 示例：
  // Sentry.captureException(error, { contexts: { custom: context } })

  // 临时方案：可以发送到自己的错误收集接口
  try {
    const errorData = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    }

    // 可以使用 sendBeacon 确保在页面卸载时也能发送
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(errorData)], {
        type: 'application/json',
      })
      navigator.sendBeacon('/api/error/log', blob)
    }
  } catch (e) {
    console.error('Failed to report error:', e)
  }
}
