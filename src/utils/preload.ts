/**
 * 路由预加载工具
 * 在用户空闲时预加载路由组件，提升页面切换速度
 */

/**
 * 预加载单个路由组件
 */
export function preloadRoute(componentLoader: () => Promise<unknown>) {
  return componentLoader().catch((err) => {
    console.warn('Failed to preload route:', err)
  })
}

/**
 * 批量预加载路由
 */
export function preloadRoutes(loaders: Array<() => Promise<unknown>>) {
  // 使用 requestIdleCallback 在浏览器空闲时加载
  if ('requestIdleCallback' in window) {
    ;(
      window as typeof window & { requestIdleCallback: (cb: IdleRequestCallback) => number }
    ).requestIdleCallback(() => {
      loaders.forEach((loader) => preloadRoute(loader))
    })
  } else {
    // 降级方案：延迟加载
    setTimeout(() => {
      loaders.forEach((loader) => preloadRoute(loader))
    }, 1000)
  }
}

/**
 * 智能预加载 - 根据用户行为预测
 */
export function smartPreload(
  element: HTMLElement,
  loader: () => Promise<unknown>,
  delay: number = 100
) {
  let timeoutId: number | null = null

  const handleMouseEnter = () => {
    timeoutId = window.setTimeout(() => {
      preloadRoute(loader)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  element.addEventListener('mouseenter', handleMouseEnter)
  element.addEventListener('mouseleave', handleMouseLeave)

  // 返回清理函数
  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter)
    element.removeEventListener('mouseleave', handleMouseLeave)
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
}

/**
 * 预链接 - 预加载关键资源
 */
export function preconnect(url: string) {
  const link = document.createElement('link')
  link.rel = 'preconnect'
  link.href = url
  document.head.appendChild(link)
}

/**
 * 预获取 - 预加载整个页面
 */
export function prefetch(url: string) {
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = url
  link.as = 'document'
  document.head.appendChild(link)
}

/**
 * 预加载资源
 */
export function preloadResource(url: string, as: string = 'script') {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = url
  link.as = as
  document.head.appendChild(link)
}
