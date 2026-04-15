<script setup lang="ts">
import { Motion } from 'motion-v'

interface Props {
  class?: string
  size?: number
  glowIntensity?: 'low' | 'medium' | 'high'
}

const _props = withDefaults(defineProps<Props>(), {
  class: '',
  size: 96,
  glowIntensity: 'medium',
})

const glowMap = {
  low: '0_0_30px_rgba(253,224,71,0.4)',
  medium: '0_0_60px_rgba(253,224,71,0.6)',
  high: '0_0_90px_rgba(253,224,71,0.8)',
}
</script>

<template>
  <Motion
    :animate="{ scale: [1, 1.1, 1] }"
    :transition="{ duration: 3, repeat: Infinity, ease: 'easeInOut' }"
    :class="['rounded-full bg-yellow-300', $props.class]"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      boxShadow: glowMap[glowIntensity],
    }"
  />
</template>
