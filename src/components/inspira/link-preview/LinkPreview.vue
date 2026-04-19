<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  url: string
  title?: string
  description?: string
  image?: string
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  delay: 500,
})

const isVisible = ref(false)
let timeoutId: ReturnType<typeof setTimeout> | null = null

function handleMouseEnter() {
  timeoutId = setTimeout(() => {
    isVisible.value = true
  }, props.delay)
}

function handleMouseLeave() {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  isVisible.value = false
}

function openLink() {
  window.open(props.url, '_blank')
}
</script>

<template>
  <div class="relative inline-block" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <!-- 触发元素 -->
    <slot>
      <span class="cursor-pointer text-primary underline">{{ title || url }}</span>
    </slot>

    <!-- 预览卡片 -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isVisible"
        class="absolute z-50 mt-2 w-80 overflow-hidden rounded-xl border bg-popover shadow-lg"
        :style="{ left: '50%', transform: 'translateX(-50%)' }"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <!-- 预览图片 -->
        <div v-if="image" class="h-40 w-full overflow-hidden">
          <img :src="image" :alt="title" class="h-full w-full object-cover" />
        </div>

        <!-- 预览内容 -->
        <div class="p-4">
          <h3 class="mb-2 font-semibold">{{ title || url }}</h3>
          <p v-if="description" class="text-sm text-muted-foreground line-clamp-2">
            {{ description }}
          </p>
          <div class="mt-3 flex items-center justify-between">
            <span class="text-xs text-muted-foreground truncate">{{ url }}</span>
            <button
              class="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground transition-colors hover:bg-primary/90"
              @click="openLink"
            >
              访问
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
