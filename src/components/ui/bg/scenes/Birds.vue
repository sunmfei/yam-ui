<script setup lang="ts">
import { Motion } from 'motion-v'

interface Bird {
  id: number
  startY: string
  delay: number
  duration: number
  size: number
}

interface Props {
  class?: string
  count?: number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  count: 3,
  color: '#1e293b',
})

// 生成飞鸟配置
const birds: Bird[] = Array.from({ length: props.count }, (_, i) => ({
  id: i + 1,
  startY: `${20 + i * 5}%`,
  delay: i * 5,
  duration: 20 + i * 2,
  size: 1 - i * 0.1,
}))
</script>

<template>
  <div :class="['absolute inset-0', $props.class]">
    <Motion
      v-for="bird in birds"
      :key="bird.id"
      class="absolute"
      :style="{
        left: '-50px',
        top: bird.startY,
        transform: `scale(${bird.size})`,
      }"
      :animate="{
        x: ['0vw', '100vw'],
        y: [0, -20, 10, -10, 0],
      }"
      :transition="{
        x: { duration: bird.duration, repeat: Infinity, ease: 'linear', delay: bird.delay },
        y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
      }"
    >
      <!-- 鸟的形状 - V字形 -->
      <svg width="30" height="15" viewBox="0 0 30 15">
        <path
          d="M 0 10 Q 7 0 15 8 Q 23 0 30 10"
          fill="none"
          :stroke="color"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </Motion>
  </div>
</template>
