/**
 * panel-component.loader.ts
 *
 * 核心作用：
 * 根据路径动态加载组件
 *
 * 模块职责：
 * 1. 扫描所有页面组件
 * 2. 提供路径解析能力
 *
 * 对外能力：
 * loadPanelComponent(path)
 *
 * 关键设计点：
 * 使用 import.meta.glob 实现懒加载
 */

import type { Component } from 'vue'

const modules = import.meta.glob<Component>('@/views/panel/**/*.vue')

/**
 * 加载组件
 *
 * 功能：
 * 根据路径返回组件（懒加载）
 *
 * 结果：
 * 返回 async component
 *
 * 设计目的：
 * 避免手动注册组件
 */
export const loadPanelComponent = (path?: string) => {
  if (!path) return null

  const fullPath = `/src/views/panel/${path}.vue`

  const loader = modules[fullPath]

  if (!loader) {
    console.warn(`⚠️ 未找到组件: ${fullPath}`)
    return null
  }

  return loader as () => Promise<Component>
}
