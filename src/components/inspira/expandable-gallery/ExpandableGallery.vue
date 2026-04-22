<script setup lang="ts">
import { ref } from 'vue'
import type { NavigationItem } from '@/components/modules/navigation/data/navigation.data'
import { ExternalLink } from 'lucide-vue-next'
import LinkPreview from '../link-preview/LinkPreview.vue'

interface Props {
  items: NavigationItem[]
}

defineProps<Props>()

const hoveredIndex = ref<number | null>(null)

function openLink(child: NavigationItem) {
  if (child.disabled) return
  window.open(child.path, child.openInNewTab ? '_blank' : '_self')
}
</script>

<template>
  <div class="flex h-full gap-2 overflow-hidden">
    <div
      v-for="(item, index) in items"
      :key="item.id"
      class="group relative flex-1 cursor-pointer overflow-hidden rounded-xl transition-all duration-500 ease-in-out"
      :class="[hoveredIndex === index ? 'flex-[3]' : 'flex-1', item.disabled ? 'opacity-50' : '']"
      @mouseenter="hoveredIndex = index"
      @mouseleave="hoveredIndex = null"
      @click="openLink(item)"
    >
      <!-- 鑳屾櫙娓愬彉 -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-muted/40 transition-all duration-500"
      />

      <!-- 鍐呭� -->
      <LinkPreview
        :url="item.path || item.url"
        :title="item.title"
        :description="item.description"
        class="relative z-10 flex h-full flex-col justify-between p-6"
      >
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span
              v-if="item.icon"
              class="text-4xl transition-transform duration-500 group-hover:scale-110"
            >
              {{ item.icon }}
            </span>
            <ExternalLink
              v-if="item.openInNewTab"
              class="h-5 w-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          </div>
          <h3 class="text-lg font-bold transition-all duration-500">{{ item.title }}</h3>
        </div>

        <!-- 搴曢儴锛氭弿杩帮紙鎮�仠鏃舵樉绀猴級 -->
        <div
          class="max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100"
        >
          <p v-if="item.description" class="text-sm text-muted-foreground">
            {{ item.description }}
          </p>
        </div>
      </LinkPreview>

      <!-- 绂佺敤閬�僵 -->
      <div v-if="item.disabled" class="absolute inset-0 z-20 cursor-not-allowed bg-black/20" />
    </div>
  </div>
</template>
