<script setup lang="ts">
/**
 * SidebarHeaderWrapper - 侧边栏头部包装组件
 */
import { GalleryVerticalEnd, AudioWaveform } from 'lucide-vue-next'
import SidebarTeamSwitcher from './SidebarTeamSwitcher.vue'

const teams = [
  {
    name: 'Yam UI',
    logo: GalleryVerticalEnd,
    plan: 'Enterprise',
  },
  {
    name: 'Personal',
    logo: AudioWaveform,
    plan: 'Free',
  },
]
</script>

<template>
  <SidebarTeamSwitcher :teams="teams" />
</template>
