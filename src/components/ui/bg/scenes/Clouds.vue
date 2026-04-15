<script setup lang="ts">
import { Motion } from 'motion-v'

interface Cloud {
  id: number
  top: string
  speed: number
  delay: number
  scale: number
}

interface Props {
  class?: string
  count?: number
  speed?: 'slow' | 'medium' | 'fast'
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  count: 3,
  speed: 'medium',
  color: 'rgba(255, 255, 255, 0.9)',
})

const speedMap = {
  slow: [60, 80, 70],
  medium: [45, 60, 50],
  fast: [30, 40, 35],
}

// 生成云朵配置
const clouds: Cloud[] = Array.from({ length: props.count }, (_, i) => ({
  id: i,
  top: `${10 + i * 5}%`,
  speed: speedMap[props.speed][i] || 60,
  delay: i * 10,
  scale: 1 - i * 0.1,
}))
</script>

<template>
  <div :class="['absolute inset-0', $props.class]">
    <Motion
      v-for="cloud in clouds"
      :key="cloud.id"
      :initial="{ x: -300 }"
      :animate="{ x: '100vw' }"
      :transition="{
        duration: cloud.speed,
        repeat: Infinity,
        ease: 'linear',
        delay: cloud.delay,
      }"
      class="absolute"
      :style="{ top: cloud.top, transform: `scale(${cloud.scale})` }"
    >
      <div
        class="h-16 w-32 rounded-full"
        :style="{ backgroundColor: color, filter: 'blur(3px)' }"
      ></div>
      <div
        class="absolute -top-6 left-6 h-20 w-20 rounded-full"
        :style="{ backgroundColor: color, filter: 'blur(3px)' }"
      ></div>
      <div
        class="absolute -top-4 left-16 h-16 w-16 rounded-full"
        :style="{ backgroundColor: color, filter: 'blur(3px)' }"
      ></div>
    </Motion>
  </div>
</template>
