<script setup lang="ts">
import { Motion } from 'motion-v'

interface Flower {
  id: number
  x: string
  color: string
  size: number
  type?: 'tulip' | 'daisy' | 'rose'
}

interface Props {
  class?: string
  count?: number
  colors?: string[]
  bottomOffset?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  count: 8,
  colors: () => ['#ef4444', '#f59e0b', '#ec4899', '#8b5cf6', '#f97316', '#fbbf24'],
  bottomOffset: 'bottom-16',
})

// 生成花朵配置
const flowers: Flower[] = Array.from({ length: props.count }, (_, i) => ({
  id: i + 1,
  x: `${10 + (i * 75) / props.count}%`,
  color: props.colors[i % props.colors.length],
  size: 5 + Math.floor(Math.random() * 3),
  type: (['tulip', 'daisy', 'rose'] as const)[i % 3],
}))
</script>

<template>
  <div :class="['absolute w-full', $props.class, bottomOffset]">
    <div v-for="flower in flowers" :key="flower.id" class="absolute" :style="{ left: flower.x }">
      <!-- 花茎 -->
      <Motion
        :animate="{ rotate: [-2, 2, -2] }"
        :transition="{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: flower.id * 0.2,
        }"
        class="mx-auto h-12 w-0.5 bg-green-600 origin-bottom"
      >
        <!-- 花朵头部 -->
        <div
          class="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full"
          :style="{
            width: `${flower.size * 3}px`,
            height: `${flower.size * 3}px`,
            backgroundColor: flower.color,
          }"
        >
          <!-- 花瓣效果 -->
          <div
            v-for="i in 5"
            :key="i"
            class="absolute rounded-full"
            :style="{
              width: `${flower.size * 2}px`,
              height: `${flower.size * 2}px`,
              backgroundColor: flower.color,
              opacity: 0.7,
              transform: `rotate(${i * 72}deg) translateY(-${flower.size}px)`,
            }"
          ></div>
          <!-- 花心 -->
          <div
            class="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300"
          ></div>
        </div>
      </Motion>
    </div>
  </div>
</template>
