<script setup lang="ts">
interface Props {
  class?: string
  size?: number
  opacity?: number
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  size: 40,
  opacity: 0.1,
})
</script>

<template>
  <div
    :class="['absolute inset-0', $props.class]"
    :style="{
      backgroundImage: `linear-gradient(rgba(128, 128, 128, ${props.opacity}) 1px, transparent 1px), 
                        linear-gradient(90deg, rgba(128, 128, 128, ${props.opacity}) 1px, transparent 1px)`,
      backgroundSize: `${props.size}px ${props.size}px`,
    }"
  ></div>
</template>
