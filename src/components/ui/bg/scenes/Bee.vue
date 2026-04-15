<script setup lang="ts">
import { Motion } from 'motion-v'

interface Bee {
  id: number
  startX: string
  startY: string
  path: 'right-up' | 'left-down' | 'circle'
  speed: number
}

interface Props {
  class?: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  count: 3,
})

// 生成蜜蜂配置
const bees: Bee[] = Array.from({ length: props.count }, (_, i) => ({
  id: i + 1,
  startX: `${20 + i * 20}%`,
  startY: `${70 + (i % 2) * 5}%`,
  path: (['right-up', 'left-down', 'circle'] as const)[i % 3],
  speed: 12 + i * 3,
}))
</script>

<template>
  <div :class="['absolute inset-0', $props.class]">
    <Motion
      v-for="bee in bees"
      :key="bee.id"
      class="absolute"
      :style="{ left: bee.startX, top: bee.startY }"
      :animate="{
        x:
          bee.path === 'right-up'
            ? [0, 100, 50, 0]
            : bee.path === 'left-down'
              ? [0, -80, -40, 0]
              : [0, 30, 60, 30, 0],
        y:
          bee.path === 'right-up'
            ? [0, -60, -30, 0]
            : bee.path === 'left-down'
              ? [0, 40, 20, 0]
              : [0, -20, 0, 20, 0],
        rotate: [0, 10, -10, 0],
      }"
      :transition="{
        duration: bee.speed,
        repeat: Infinity,
        ease: 'easeInOut',
      }"
    >
      <!-- 蜜蜂身体 -->
      <div class="relative">
        <div
          class="h-3 w-4 rounded-full bg-gradient-to-r from-yellow-400 via-black to-yellow-400 shadow-sm"
        >
          <!-- 翅膀 -->
          <Motion
            :animate="{ scaleY: [1, 0.3, 1] }"
            :transition="{ duration: 0.1, repeat: Infinity }"
            class="absolute -top-2 left-0 h-2 w-3 rounded-full bg-white opacity-70"
          />
          <Motion
            :animate="{ scaleY: [1, 0.3, 1] }"
            :transition="{ duration: 0.1, repeat: Infinity }"
            class="absolute -top-2 right-0 h-2 w-3 rounded-full bg-white opacity-70"
          />
        </div>
      </div>
    </Motion>
  </div>
</template>
