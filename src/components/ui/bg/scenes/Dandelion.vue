<script setup lang="ts">
import { Motion } from 'motion-v'

interface DandelionSeed {
  id: number
  x: string
  y: string
  duration: number
  delay: number
  distanceX: number
  distanceY: number
  rotation: number
  size: string
}

interface GroundDandelion {
  id: number
  x: string
  swayDelay: number
}

interface Props {
  class?: string
  flyingCount?: number
  groundCount?: number
  seedColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  flyingCount: 5,
  groundCount: 5,
  seedColor: 'rgba(255, 255, 255, 0.95)',
})

// 飞散的蒲公英种子
const flyingSeeds: DandelionSeed[] = Array.from({ length: props.flyingCount }, (_, i) => ({
  id: i + 1,
  x: `${20 + i * 15}%`,
  y: `${55 + (i % 3) * 5}%`,
  duration: 15 + i * 2,
  delay: i * 3,
  distanceX: i % 2 === 0 ? 280 + i * 20 : -250 - i * 15,
  distanceY: -200 + i * 10,
  rotation: i % 2 === 0 ? 360 : -360,
  size: i < 2 ? 'w-2 h-2' : 'w-1.5 h-1.5',
}))

// 草地上的蒲公�?
const groundDandelions: GroundDandelion[] = Array.from({ length: props.groundCount }, (_, i) => ({
  id: i + 1,
  x: `${18 + i * 16}%`,
  swayDelay: i * 0.5,
}))
</script>

<template>
  <div :class="['absolute inset-0', $props.class]">
    <!-- 飞散的种�?-->
    <Motion
      v-for="seed in flyingSeeds"
      :key="`flying-${seed.id}`"
      :class="['absolute rounded-full', seed.size]"
      :style="{
        backgroundColor: seedColor,
        boxShadow: `0 0 10px ${seedColor}`,
        top: seed.y,
        left: seed.x,
      }"
      :animate="{
        x: [0, seed.distanceX, 0],
        y: [0, seed.distanceY, 0],
        rotate: [0, seed.rotation, 0],
        opacity: [0, 1, 1, 0],
      }"
      :transition="{
        duration: seed.duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: seed.delay,
        times: [0, 0.1, 0.9, 1],
      }"
    />

    <!-- 草地上的蒲公�?-->
    <div
      v-for="d in groundDandelions"
      :key="`ground-${d.id}`"
      class="absolute bottom-16"
      :style="{ left: d.x }"
    >
      <Motion
        :animate="{ rotate: [-3, 3, -3] }"
        :transition="{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: d.swayDelay,
        }"
        class="mx-auto h-10 w-0.5 bg-green-500 origin-bottom"
      >
        <!-- 蒲公英种子球 -->
        <div class="absolute -top-3 left-1/2 -translate-x-1/2">
          <div
            class="h-6 w-6 rounded-full bg-white opacity-90 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
          >
            <!-- 种子细节 -->
            <div
              v-for="i in 8"
              :key="i"
              class="absolute h-0.5 w-3 bg-gray-300"
              :style="{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
              }"
            ></div>
          </div>
        </div>
      </Motion>
    </div>
  </div>
</template>
