<script setup lang="ts">
import { ref } from 'vue'
import type { NavigationChild } from '@/types'
import { ExternalLink } from 'lucide-vue-next'
import LinkPreview from '../link-preview/LinkPreview.vue'

interface Props {
  items: NavigationChild[]
}

defineProps<Props>()

const hoveredIndex = ref<number | null>(null)

function openLink(child: NavigationChild) {
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
      <!-- 背景渐变 -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-muted/40 transition-all duration-500"
      />

      <!-- 内容 -->
      <LinkPreview
        :url="item.path"
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

        <!-- 底部：描述（悬停时显示） -->
        <div
          class="max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100"
        >
          <p v-if="item.description" class="text-sm text-muted-foreground">
            {{ item.description }}
          </p>
        </div>
      </LinkPreview>

      <!-- 禁用遮罩 -->
      <div v-if="item.disabled" class="absolute inset-0 z-20 cursor-not-allowed bg-black/20" />
    </div>
  </div>
</template>
