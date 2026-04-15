<script setup lang="ts">
import { Motion } from 'motion-v'

interface ShootingStar {
  id: number
  startX: string
  startY: string
  delay: number
  duration: number
}

interface Props {
  class?: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  count: 3,
})

// 生成流星配置
const shootingStars: ShootingStar[] = Array.from({ length: props.count }, (_, i) => ({
  id: i + 1,
  startX: `${60 + i * 10}%`,
  startY: `${5 + i * 5}%`,
  delay: 3 + i * 5,
  duration: 1.5 + i * 0.5,
}))
</script>

<template>
  <div :class="['absolute inset-0', $props.class]">
    <Motion
      v-for="meteor in shootingStars"
      :key="meteor.id"
      class="absolute h-0.5 w-20"
      :style="{
        left: meteor.startX,
        top: meteor.startY,
        background: 'linear-gradient(to right, transparent, white)',
        transform: 'rotate(-45deg)',
      }"
      :initial="{ opacity: 0, x: 0, y: 0 }"
      :animate="{
        opacity: [0, 1, 0],
        x: 300,
        y: 300,
      }"
      :transition="{
        duration: meteor.duration,
        repeat: Infinity,
        delay: meteor.delay,
        ease: 'easeOut',
      }"
    />
  </div>
</template>
