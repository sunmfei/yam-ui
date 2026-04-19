<script setup lang="ts">
import { ref } from 'vue'

interface DockItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any
  label: string
  onClick?: () => void
}

interface Props {
  items: DockItem[]
  magnification?: number
  distance?: number
  direction?: 'top' | 'middle' | 'bottom'
}

const props = withDefaults(defineProps<Props>(), {
  magnification: 60,
  distance: 140,
  direction: 'middle',
})

const mouseX = ref(0)
const dockRef = ref<HTMLElement | null>(null)

function handleMouseMove(e: MouseEvent) {
  if (!dockRef.value) return
  const rect = dockRef.value.getBoundingClientRect()
  mouseX.value = e.clientX - rect.left
}

function getTransformStyle(index: number) {
  if (!dockRef.value) return {}

  const rect = dockRef.value.getBoundingClientRect()
  const itemCenterX = (index + 0.5) * (rect.width / props.items.length)
  const distance = Math.abs(mouseX.value - itemCenterX)

  if (distance > props.distance) return {}

  const scale = 1 + (props.magnification / 100) * (1 - distance / props.distance)
  return {
    transform: `scale(${scale})`,
  }
}
</script>

<template>
  <div
    ref="dockRef"
    class="flex items-end gap-2 rounded-full border bg-background/80 px-4 py-3 shadow-lg backdrop-blur-sm"
    @mousemove="handleMouseMove"
    @mouseleave="mouseX = 0"
  >
    <button
      v-for="(item, index) in items"
      :key="index"
      class="relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:bg-accent"
      :style="getTransformStyle(index)"
      @click="item.onClick"
    >
      <component :is="item.icon" class="h-5 w-5" />
      <span
        class="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 shadow-md transition-opacity"
        :class="{ 'opacity-100': mouseX !== 0 }"
      >
        {{ item.label }}
      </span>
    </button>
  </div>
</template>
