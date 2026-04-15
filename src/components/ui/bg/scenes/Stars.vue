<script setup lang="ts">
import { Motion } from 'motion-v'

interface Star {
  id: number
  x: string
  y: string
  size: string
  delay: number
  duration: number
}

interface Props {
  class?: string
  count?: number
  area?: 'full' | 'top-half' | 'custom'
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  count: 50,
  area: 'top-half',
})

// 生成星星配置
const stars: Star[] = Array.from({ length: props.count }, (_, i) => ({
  id: i,
  x: `${Math.random() * 100}%`,
  y: props.area === 'top-half' ? `${Math.random() * 60}%` : `${Math.random() * 100}%`,
  size: Math.random() > 0.7 ? 'w-1 h-1' : 'w-0.5 h-0.5',
  delay: Math.random() * 5,
  duration: 2 + Math.random() * 3,
}))
</script>

<template>
  <div :class="['absolute inset-0', $props.class]">
    <Motion
      v-for="star in stars"
      :key="star.id"
      :class="['absolute rounded-full bg-white', star.size]"
      :style="{
        left: star.x,
        top: star.y,
      }"
      :animate="{
        opacity: [0.2, 1, 0.2],
        scale: [1, 1.5, 1],
      }"
      :transition="{
        duration: star.duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: star.delay,
      }"
    />
  </div>
</template>
