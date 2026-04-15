<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { computed } from 'vue'
import ParticlesBg from '@/components/ui/ParticlesBg.vue'

const isDark = computed(() => useColorMode().value === 'dark')
</script>

<template>
  <ParticlesBg
    :key="isDark.toString()"
    class="absolute inset-0"
    :quantity="100"
    :ease="100"
    :color="isDark ? '#FFF' : '#000'"
    :staticity="10"
    refresh
  />
</template>
