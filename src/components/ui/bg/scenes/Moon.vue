<script setup lang="ts">
import { Motion } from 'motion-v'

interface Props {
  class?: string
  size?: number
  phase?: 'crescent' | 'half' | 'full'
}

withDefaults(defineProps<Props>(), {
  class: '',
  size: 90,
  phase: 'crescent',
})
</script>

<template>
  <div :class="$props.class" :style="{ width: `${size}px`, height: `${size}px` }">
    <Motion
      :animate="{
        y: [0, -15, 0],
        rotate: [0, 2, 0],
      }"
      :transition="{
        y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        boxShadow: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
      }"
      class="relative"
    >
      <!-- 外层光晕背景 -->
      <div
        class="absolute -inset-6 rounded-full bg-gradient-to-br from-yellow-100 via-yellow-200 to-amber-200 opacity-25 blur-2xl"
      ></div>

      <!-- 月亮 SVG -->
      <svg
        :width="size"
        :height="size"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        class="relative block drop-shadow-[0_0_30px_rgba(255,248,200,0.6)]"
        style="overflow: visible"
      >
        <defs>
          <!-- 月光渐变 -->
          <radialGradient id="moonGradient-nature" cx="40%" cy="50%" r="60%">
            <stop offset="0%" stop-color="#fffbeb" />
            <stop offset="50%" stop-color="#fef3c7" />
            <stop offset="100%" stop-color="#fde68a" />
          </radialGradient>

          <!-- 发光滤镜 -->
          <filter id="moonGlow-nature">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <!-- 月牙遮罩 -->
          <mask id="crescentMask-nature">
            <rect width="100" height="100" fill="white" />
            <circle cx="38" cy="40" r="30" fill="black" />
          </mask>
        </defs>

        <!-- 月亮主体光晕层 -->
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="url(#moonGradient-nature)"
          opacity="0.3"
          filter="url(#moonGlow-nature)"
        />

        <!-- 月亮主体 -->
        <circle
          cx="50"
          cy="50"
          r="32"
          fill="url(#moonGradient-nature)"
          :mask="phase === 'crescent' ? 'url(#crescentMask-nature)' : undefined"
          filter="url(#moonGlow-nature)"
          opacity="0.95"
        />

        <!-- 月球表面纹理（只放亮面区域） -->
        <circle cx="35" cy="38" r="2.5" fill="#d97706" opacity="0.25" />
        <circle cx="38" cy="48" r="2" fill="#d97706" opacity="0.2" />
        <circle cx="33" cy="58" r="2.2" fill="#d97706" opacity="0.18" />
        <circle cx="40" cy="62" r="1.6" fill="#d97706" opacity="0.15" />
        <circle cx="36" cy="52" r="1.8" fill="#d97706" opacity="0.15" />
      </svg>
    </Motion>
  </div>
</template>
