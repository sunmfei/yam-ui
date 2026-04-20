<script setup lang="ts">
/**
 * 功能：磁吸交互
 * 结果：卡片跟随鼠标
 * 设计目的：增强交互体验
 */
import { ref } from 'vue'

const el = ref<HTMLElement | null>(null)

function handleMove(e: MouseEvent) {
  if (!el.value) return
  const rect = el.value.getBoundingClientRect()
  const x = (e.clientX - rect.left - rect.width / 2) / 20
  const y = (e.clientY - rect.top - rect.height / 2) / 20
  el.value.style.transform = `translate(${x}px, ${y}px)`
}

function reset() {
  if (!el.value) return
  el.value.style.transform = `translate(0,0)`
}
</script>

<template>
  <div
    ref="el"
    class="transition-transform duration-200"
    @mousemove="handleMove"
    @mouseleave="reset"
  >
    <slot />
  </div>
</template>
