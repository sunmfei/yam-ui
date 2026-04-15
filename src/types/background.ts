/**
 * 背景类型定义
 */
export type BackgroundType = 'particles' | 'gradient' | 'grid' | 'wave' | 'nature' | 'none'

/**
 * 背景选项接口
 */
export interface BackgroundOption {
  label: string
  value: BackgroundType
}

/**
 * 背景选项列表
 */
export const BACKGROUND_OPTIONS: BackgroundOption[] = [
  { label: '粒子效果', value: 'particles' },
  { label: '渐变光晕', value: 'gradient' },
  { label: '网格线条', value: 'grid' },
  { label: '波浪动画', value: 'wave' },
  { label: '自然风景', value: 'nature' },
  { label: '无背景', value: 'none' },
]
