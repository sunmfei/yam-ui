<script setup lang="ts">
/**
 * 功能：统一页面动效
 * 结果：渐入动画
 * 设计目的：统一动画入口
 */
import { Motion } from 'motion-v'
</script>

<template>
  <Motion
    :initial="{ opacity: 0, y: 20 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.4 }"
  >
    <slot />
  </Motion>
</template>
