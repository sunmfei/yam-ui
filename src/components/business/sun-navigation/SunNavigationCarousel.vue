<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NavigationItem } from '@/components/modules/navigation/data/navigation.data'
import ExpandableGallery from '@/components/inspira/expandable-gallery/ExpandableGallery.vue'
import BaseButton from '@/components/base/button/BaseButton.vue'

interface Props {
  items: NavigationItem[]
}

const props = defineProps<Props>()

// 当前激活的卡片索引
const activeIndex = ref(0)

// 过滤可见的分�?
const visibleItems = computed(() => {
  return props.items.filter((item) => !item.hidden && item.children && item.children.length > 0)
})

// 切换到指定卡�?
function goTo(index: number) {
  activeIndex.value = index
}

// 下一�?
function next() {
  if (activeIndex.value < visibleItems.value.length - 1) {
    activeIndex.value++
  }
}

// 上一�?
function prev() {
  if (activeIndex.value > 0) {
    activeIndex.value--
  }
}
</script>

<template>
  <div class="relative w-full">
    <!-- 背景装饰 -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div class="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div
        class="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary/5 to-muted/10 blur-3xl"
      />
    </div>

    <!-- 卡片容器 -->
    <div class="relative z-10 h-[500px] overflow-hidden">
      <TransitionGroup name="carousel" tag="div" class="h-full">
        <div
          v-for="(item, index) in visibleItems"
          v-show="index === activeIndex"
          :key="item.id"
          class="absolute inset-0 flex flex-col"
        >
          <!-- 卡片背景渐变 -->
          <div
            class="absolute inset-0 rounded-3xl border bg-gradient-to-br from-background/80 via-background to-muted/20 shadow-xl backdrop-blur-sm transition-all duration-500"
          />

          <!-- 装饰性光�?-->
          <div class="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
          <div class="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />

          <!-- 卡片内容 -->
          <div class="relative z-10 flex h-full flex-col p-8">
            <!-- 卡片头部 -->
            <div class="mb-6 flex items-start justify-between">
              <div class="space-y-2">
                <div class="flex items-center gap-3">
                  <span v-if="item.icon" class="text-4xl">{{ item.icon }}</span>
                  <h2 class="text-3xl font-bold">{{ item.title }}</h2>
                </div>
                <p v-if="item.description" class="text-muted-foreground">
                  {{ item.description }}
                </p>
              </div>
              <div class="rounded-full bg-secondary px-3 py-1 text-sm font-medium">
                {{ item.children?.length }} 个网�?
              </div>
            </div>

            <!-- 导航�?Expandable Gallery -->
            <ExpandableGallery :items="item.children?.filter((c) => !c.hidden) || []" />
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- 底部控制�?-->
    <div class="mt-6 flex items-center justify-between">
      <!-- 指示�?-->
      <div class="flex gap-2">
        <button
          v-for="(_, index) in visibleItems"
          :key="index"
          class="h-2 rounded-full transition-all duration-300"
          :class="
            index === activeIndex ? 'w-8 bg-primary' : 'w-2 bg-muted hover:bg-muted-foreground/50'
          "
          @click="goTo(index)"
        />
      </div>

      <!-- 导航按钮 -->
      <div class="flex gap-2">
        <BaseButton size="sm" variant="outline" :disabled="activeIndex === 0" @click="prev">
          上一�?
        </BaseButton>
        <BaseButton
          size="sm"
          variant="outline"
          :disabled="activeIndex === visibleItems.length - 1"
          @click="next"
        >
          下一�?
        </BaseButton>
      </div>
    </div>

    <!-- 空状�?-->
    <div v-if="visibleItems.length === 0" class="py-20 text-center">
      <p class="text-lg text-muted-foreground">暂无导航数据</p>
    </div>
  </div>
</template>

<style scoped>
.carousel-enter-active,
.carousel-leave-active {
  transition: all 0.5s ease;
}

.carousel-enter-from {
  opacity: 0;
  transform: translateX(100px) scale(0.95);
}

.carousel-leave-to {
  opacity: 0;
  transform: translateX(-100px) scale(0.95);
}

.carousel-move {
  transition: transform 0.5s ease;
}
</style>
