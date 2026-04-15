<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import {
  Sun,
  Moon,
  Stars,
  Clouds,
  Grass,
  Flowers,
  Dandelion,
  Bee,
  Birds,
  ShootingStars,
} from './scenes'

interface Props {
  class?: string
}

withDefaults(defineProps<Props>(), {
  class: '',
})

const appStore = useAppStore()

// 根据主题调整颜色
const cloudColor = computed(() => {
  return appStore.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)'
})

const grassColor = computed(() => {
  return appStore.isDark ? '#1b4332' : '#52b788'
})

const dandelionColor = computed(() => {
  return appStore.isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.95)'
})
</script>

<template>
  <div
    :class="['absolute inset-0 overflow-hidden', $props.class]"
    :style="{
      background: appStore.isDark
        ? 'linear-gradient(to bottom, rgba(2, 6, 23, 0.85) 0%, rgba(15, 23, 42, 0.85) 40%, rgba(30, 41, 59, 0.85) 100%)'
        : 'linear-gradient(to bottom, rgba(56, 189, 248, 0.85) 0%, rgba(125, 211, 252, 0.85) 50%, rgba(186, 230, 253, 0.85) 100%)',
    }"
  >
    <!-- 白天场景：太阳 -->
    <Sun v-if="!appStore.isDark" class="absolute right-20 top-20" />

    <!-- 夜晚场景：月亮 -->
    <Moon v-else class="absolute right-20 top-20 z-10" />

    <!-- 夜晚场景：星星 -->
    <Stars v-if="appStore.isDark" :count="250" area="top-half" />

    <!-- 夜晚场景：流星 -->
    <ShootingStars v-if="appStore.isDark" :count="3" />

    <!-- 白天场景：飞鸟 -->
    <Birds v-if="!appStore.isDark" :count="3" />

    <!-- 云朵层 -->
    <Clouds :color="cloudColor" :speed="'medium'" :count="3" />

    <!-- 小蜜蜂 -->
    <Bee :count="4" />

    <!-- 主草地 (第一层) -->
    <Grass :color="grassColor" :height="400" :layers="1" :animated="true" />

    <!-- 草地上的花朵和植物 -->
    <div class="absolute bottom-0 w-full" style="height: 400px; z-index: 1">
      <Flowers :count="6" bottom-offset="bottom-32" />
      <Dandelion :flying-count="0" :ground-count="5" :seed-color="dandelionColor" />
    </div>

    <!-- 蒲公英种子(飞散) -->
    <Dandelion :flying-count="5" :ground-count="5" :seed-color="dandelionColor" />
  </div>
</template>
