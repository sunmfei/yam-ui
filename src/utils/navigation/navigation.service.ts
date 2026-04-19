/**
 * navigation.service.ts
 *
 * 核心作用：
 * 管理用户自定义导航数据，支持 localStorage 持久化
 *
 * 模块职责：
 * 1. 从 localStorage 读取导航数据
 * 2. 保存导航数据到 localStorage
 * 3. 提供默认导航数据
 *
 * 对外能力：
 * - getNavigations(): 获取所有导航项
 * - saveNavigations(): 保存导航项
 * - getDefaultNavigations(): 获取默认导航项
 *
 * 关键设计点：
 * 使用 localStorage 实现数据持久化
 */

import type { NavigationItem } from '@/types'

const STORAGE_KEY = 'yam-ui-navigations'

/**
 * 默认导航数据（硬编码）
 */
const defaultNavigations: NavigationItem[] = [
  {
    id: 'nav-home',
    title: '首页',
    icon: 'Home',
    path: '/',
    description: '返回应用首页',
    order: 1,
  },
  {
    id: 'nav-admin',
    title: '后端管理',
    icon: 'Settings',
    path: '/admin',
    description: '系统管理后台',
    order: 2,
  },
  {
    id: 'nav-demo',
    title: '功能演示',
    icon: 'LayoutDashboard',
    path: '/demo',
    description: '组件和功能演示',
    order: 3,
  },
]

/**
 * 获取所有导航项
 */
export const getNavigations = (): NavigationItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as NavigationItem[]
    }
  } catch (error) {
    console.error('Failed to load navigations from localStorage:', error)
  }

  // 如果没有数据，返回默认数据并保存
  saveNavigations(defaultNavigations)
  return [...defaultNavigations]
}

/**
 * 保存导航项
 */
export const saveNavigations = (navigations: NavigationItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(navigations))
  } catch (error) {
    console.error('Failed to save navigations to localStorage:', error)
  }
}

/**
 * 获取默认导航项
 */
export const getDefaultNavigations = (): NavigationItem[] => {
  return [...defaultNavigations]
}

/**
 * 重置为默认导航
 */
export const resetToDefault = (): NavigationItem[] => {
  saveNavigations(defaultNavigations)
  return [...defaultNavigations]
}
