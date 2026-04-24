<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores'

/**
 * DefaultBackground（优化升级版）
 *
 * 文件核心作用：
 * 提供统一系统默认背景层，解决暗色模式发灰、浅色模式廉价问题
 *
 * 模块职责划分：
 * - ThemeLayer：主题底色与渐变
 * - GlowLayer：环境光氛围增强
 * - NoiseLayer：微纹理质感补充
 *
 * 整体结构说明：
 * fixed全屏容器 + 三层视觉叠加
 *
 * 对外能力或接口说明：
 * 仅响应主题状态，无交互能力
 *
 * 关键设计点总结：
 * - 暗色不死黑
 * - 浅色不死白
 * - 光影分层控制
 * - 低干扰高级感
 */

defineOptions({
  name: 'DefaultBackground',
})

const appStore = useAppStore()

const isDark = computed(() => appStore.isDark)
</script>

<template>
  <div class="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
    <!-- 主题底色层 -->
    <div
      class="absolute inset-0 transition-all duration-500"
      :class="
        isDark
          ? 'bg-gradient-to-b from-[#070b14] to-[#0b1220]'
          : 'bg-gradient-to-b from-[#f7f8fc] to-[#eef1f8]'
      "
    />

    <!-- 氛围光影层 -->
    <div class="absolute inset-0">
      <!-- 左上冷光 -->
      <div
        class="absolute -top-1/3 -left-1/4 w-[650px] h-[650px] rounded-full blur-[150px]"
        :class="isDark ? 'bg-blue-500/10' : 'bg-blue-300/20'"
      />

      <!-- 右下紫光 -->
      <div
        class="absolute bottom-0 -right-1/4 w-[600px] h-[600px] rounded-full blur-[160px]"
        :class="isDark ? 'bg-purple-500/10' : 'bg-pink-300/20'"
      />

      <!-- 中央柔光 -->
      <div
        class="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full blur-[180px]"
        :class="isDark ? 'bg-cyan-400/5' : 'bg-indigo-200/10'"
      />
    </div>

    <!-- 微纹理层 -->
    <div class="absolute inset-0 opacity-[0.025] noise-layer" />
  </div>
</template>

<style scoped>
.noise-layer {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E");
}
</style>
