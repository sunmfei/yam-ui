<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import { ICON_POOL } from '@/config/types/icon.pool'
import { getIconByName } from '@/config/types/icon.data'
import { AlertCircle } from 'lucide-vue-next'

/**
 * Icon 组件
 * 支持：
 * 1. icon（直接组件）
 * 2. name（字符串）
 * 3. fallback
 */

const props = defineProps<{
  /** string 方式 */
  name?: keyof typeof ICON_POOL | string

  /** 直接传组件 */
  icon?: Component

  /** 尺寸 */
  size?: number | string

  /** 颜色 */
  color?: string
}>()

/**
 * 解析 icon（同步版本，避免 computed async 问题）
 */
const resolvedIcon = computed<Component>(() => {
  // 1️⃣ 优先组件模式
  if (props.icon) return props.icon

  // 2️⃣ string -> 从 lucide-vue-next 获取组件
  if (props.name) {
    // 先尝试从 ICON_POOL 获取图标名
    const poolIcon = ICON_POOL[props.name as keyof typeof ICON_POOL]
    const iconName = poolIcon || props.name

    // 从 lucide-vue-next 动态获取组件
    const lucideComponent = getIconByName(iconName)
    if (lucideComponent) return lucideComponent
  }

  // 3️⃣ 最终兜底
  return AlertCircle
})

/**
 * 样式控制
 */
const style = computed(() => {
  const size = props.size ?? 20

  return {
    width: typeof size === 'number' ? `${size}px` : size,
    height: typeof size === 'number' ? `${size}px` : size,
    color: props.color || undefined,
  }
})
</script>

<template>
  <component :is="resolvedIcon" :style="style" />
</template>
