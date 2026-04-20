<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { SakuraBg } from './index'

/**
 * 极简樱花背景 - 仅保留飘落花瓣和柔和的天空渐变
 */
const appStore = useAppStore()

// 天空渐变：上方天蓝 → 下方极淡粉（几乎透明）
const bgColor = computed(() => {
  return appStore.isDark
    ? 'linear-gradient(to bottom, #0f172a 0%, #1e1b3a 50%, #2d1b4e 100%)'
    : 'linear-gradient(to bottom, #d6f0ff 0%, #eaf6fc 60%, #f9f7fa 90%, #fcfbfd 100%)'
})
</script>

<template>
  <div class="relative w-full h-full overflow-hidden" :style="{ background: bgColor }">
    <!-- 樱花飘落层 -->
    <SakuraBg class="absolute inset-0 z-0" />
  </div>
</template>
