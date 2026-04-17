<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import ParticlesBg from './ParticlesBg.vue'
import GradientBg from './GradientBg.vue'
import GridBg from './GridBg.vue'
import WaveBg from './WaveBg.vue'

const appStore = useAppStore()

// 根据当前主题计算粒子颜色
const particleColor = computed(() => {
  return appStore.isDark ? '#FFF' : '#000'
})
</script>

<template>
  <div class="fixed inset-0 -z-50 overflow-hidden">
    <!-- 粒子背景 -->
    <ParticlesBg
      v-if="appStore.backgroundType === 'particles'"
      :key="appStore.isDark.toString()"
      class="absolute inset-0"
      :quantity="1000"
      :ease="50"
      :color="particleColor"
      :staticity="10"
      refresh
    />

    <!-- 渐变背景 -->
    <GradientBg v-else-if="appStore.backgroundType === 'gradient'" />

    <!-- 网格背景 -->
    <GridBg v-else-if="appStore.backgroundType === 'grid'" :size="40" :opacity="0.1" />

    <!-- 波浪背景 -->
    <WaveBg v-else-if="appStore.backgroundType === 'wave'" />

    <!-- 默认背景（当选择 none 时显示基础背景色） -->
    <div v-else class="absolute inset-0 bg-white dark:bg-gray-900"></div>
  </div>
</template>
