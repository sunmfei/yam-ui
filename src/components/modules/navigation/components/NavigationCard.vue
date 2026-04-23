<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { NavigationItem } from '@/components/modules'
import * as Icons from 'lucide-vue-next'
import { computed } from 'vue'
import MagneticCard from './effect/MagneticCard.vue'
import GlowBox from './effect/GlowBox.vue'
import { LinkPreview } from '@/components/inspira'
import { BaseIframe } from '@/components/base'

const props = defineProps<{
  item: NavigationItem
}>()

function open() {
  window.open(props.item.url, '_blank')
}

// 动态获取图标组件
const IconComponent = computed(() => {
  if (!props.item.icon) return null
  const iconName = props.item.icon as keyof typeof Icons
  return Icons[iconName] || null
})
</script>

<template>
  <MagneticCard>
    <GlowBox>
      <Card class="cursor-pointer hover:shadow-xl transition" @click="open">
        <LinkPreview :url="item?.url || '/'" class="p-4 space-y-3font-bold">
          <!-- 图标 -->
          <div
            v-if="IconComponent"
            class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
          >
            <component :is="IconComponent" class="w-5 h-5 text-primary" />
          </div>

          <!-- 美化版 iframe -->
          <BaseIframe
            :config="{
              src: item.url,
              height: '200px',
              loading: true,
            }"
            :rounded="true"
            :shadow="true"
            :border="true"
          />

          <!-- 描述 -->
          <div class="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
            {{ item.description }}
          </div>

          <!-- 分类标签 -->
          <Badge variant="secondary" class="text-xs">
            {{ item.category }}
          </Badge>
        </LinkPreview>
      </Card>
    </GlowBox>
  </MagneticCard>
</template>
