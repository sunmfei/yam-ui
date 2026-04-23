/*
文件核心作用：
iframe 组件库全局配置中心

模块职责划分：
- 提供全局配置（timeout / 白名单 / 埋点）
- 提供依赖注入

整体结构说明：
app -> provider -> iframe组件

对外能力或接口说明：
provide/useConfig

关键设计点总结：
- 统一配置入口
- 解耦组件与业务
*/

import { provide, inject } from 'vue'

const IFRAME_CONFIG = Symbol('IFRAME_CONFIG')

export function provideIframeConfig(config: {
  timeout?: number
  whitelist?: string[]
  onEvent?: (type: string, payload: unknown) => void
}) {
  provide(IFRAME_CONFIG, config)
}

export function useIframeConfig() {
  return inject(IFRAME_CONFIG, {
    timeout: 5000,
    whitelist: [],
    onEvent: () => {},
  })
}
