<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { BaseParticlesBg, BaseGradientBg, BaseGridBg, BaseWaveBg } from '@/components/base/ui-proxy'
import { NatureBg, SakuraTreeSceneBg } from '@/components/ui/bg'

/**
 * BaseBackground - 基础背景组件
 *
 * 提供多种背景效果：粒子、渐变、网格、波浪、樱�?
 */
defineOptions({
  name: 'BaseBackground',
})

const appStore = useAppStore()

// 根据当前主题计算粒子颜色
const particleColor = computed(() => {
  return appStore.isDark ? '#FFF' : '#000'
})
</script>

<template>
  <div class="fixed inset-0 -z-50 overflow-hidden">
    <!-- 粒子背景 -->
    <BaseParticlesBg
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
    <BaseGradientBg v-else-if="appStore.backgroundType === 'gradient'" />

    <!-- 网格背景 -->
    <BaseGridBg v-else-if="appStore.backgroundType === 'grid'" :size="40" :opacity="0.1" />

    <!-- 波浪背景 -->
    <BaseWaveBg v-else-if="appStore.backgroundType === 'wave'" />

    <!-- 自然背景 -->
    <NatureBg v-else-if="appStore.backgroundType === 'nature'" />

    <!-- 樱花树场景背�?-->
    <SakuraTreeSceneBg v-else-if="appStore.backgroundType === 'sakura'" class="absolute inset-0" />

    <!-- 默认背景（当选择 none 时显示基础背景色） -->
    <div v-else class="absolute inset-0 bg-white dark:bg-gray-900"></div>
  </div>
</template>
