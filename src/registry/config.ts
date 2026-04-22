/**
 * Registry Config - 占位文件
 * TODO: 实现完整的 registry 配置系统
 */

import { z } from 'zod'

// 类型定义（占位）
export type BaseColorName = string
export type BaseName = string
export type FontValue = string
export type IconLibraryName = string
export type MenuAccentValue = string
export type MenuColorValue = string
export type RadiusValue = string
export type StyleName = string
export type ThemeName = string

export interface DesignSystemConfig {
  // TODO: Define config structure
  [key: string]: any
}

export const designSystemConfigSchema = z.object({}).passthrough()

export const DEFAULT_CONFIG: DesignSystemConfig = {}
