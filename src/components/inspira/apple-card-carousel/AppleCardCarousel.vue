<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NavigationItem, NavigationChild } from '@/types'
import { ExternalLink } from 'lucide-vue-next'
import BaseButton from '@/components/base/button/BaseButton.vue'

interface Props {
  items: NavigationItem[]
}

const props = defineProps<Props>()

// 当前激活的卡片索引
const activeIndex = ref(0)

// 过滤可见的分类
const visibleItems = computed(() => {
  return props.items.filter((item) => !item.hidden && item.children && item.children.length > 0)
})

// 切换到指定卡片
function goTo(index: number) {
  activeIndex.value = index
}

// 下一个
function next() {
  if (activeIndex.value < visibleItems.value.length - 1) {
    activeIndex.value++
  }
}

// 上一个
function prev() {
  if (activeIndex.value > 0) {
    activeIndex.value--
  }
}

// 打开链接
function openLink(child: NavigationChild) {
  if (child.disabled) return
  window.open(child.path, child.openInNewTab ? '_blank' : '_self')
}
</script>

<template>
  <div class="relative w-full">
    <!-- 卡片容器 -->
    <div class="relative h-[500px] overflow-hidden">
      <TransitionGroup name="carousel" tag="div" class="h-full">
        <div
          v-for="(item, index) in visibleItems"
          v-show="index === activeIndex"
          :key="item.id"
          class="absolute inset-0 flex flex-col"
        >
          <!-- 卡片背景渐变 -->
          <div
            class="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-background to-muted/30 transition-all duration-500"
          />

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
                {{ item.children?.length }} 个网站
              </div>
            </div>

            <!-- 导航项网格 -->
            <div
              class="grid flex-1 grid-cols-1 gap-4 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3"
            >
              <BaseButton
                v-for="child in item.children?.filter((c) => !c.hidden)"
                :key="child.id"
                variant="outline"
                :disabled="child.disabled"
                class="group h-auto flex-col items-start gap-3 p-5 transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                @click="openLink(child)"
              >
                <div class="flex w-full items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span
                      v-if="child.icon"
                      class="text-2xl transition-transform group-hover:scale-110"
                    >
                      {{ child.icon }}
                    </span>
                    <span class="font-semibold">{{ child.title }}</span>
                  </div>
                  <ExternalLink
                    v-if="child.openInNewTab"
                    class="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </div>
                <p
                  v-if="child.description"
                  class="line-clamp-2 text-left text-xs text-muted-foreground"
                >
                  {{ child.description }}
                </p>
              </BaseButton>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- 底部控制栏 -->
    <div class="mt-6 flex items-center justify-between">
      <!-- 指示器 -->
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
          上一个
        </BaseButton>
        <BaseButton
          size="sm"
          variant="outline"
          :disabled="activeIndex === visibleItems.length - 1"
          @click="next"
        >
          下一个
        </BaseButton>
      </div>
    </div>

    <!-- 空状态 -->
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
