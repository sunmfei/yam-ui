<script setup lang="ts">
import { computed } from 'vue'
import type { HTMLAttributes, Component } from 'vue'
import { XIcon } from 'lucide-vue-next'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import { cn } from '@/lib/utils'
import BaseButton from '@/components/base/button/BaseButton.vue'
import BaseContainer from '@/components/base/container/BaseContainer.vue'
import type { ContainerSize } from '@/components/base/container/BaseContainer.vue'

/**
 * BaseDialog - 基础对话框组件
 *
 * 特性：
 * - 使用 BaseContainer 控制尺寸
 * - 支持预设尺寸：small | medium | large | custom
 * - 支持自定义宽高
 * - 支持全屏模式
 * - 可传入任意组件作为内容
 * - 配置化的标题和按钮
 */
defineOptions({
  name: 'BaseDialog',
})

interface DialogButton {
  label: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  onClick?: () => void
}

const props = withDefaults(
  defineProps<{
    /** 对话框是否打开 */
    open?: boolean
    class?: HTMLAttributes['class']
    /** 是否显示关闭按钮 */
    showCloseButton?: boolean
    /** 预设尺寸 */
    size?: ContainerSize
    /** 自定义宽度（size='custom' 时生效） */
    customWidth?: string
    /** 自定义高度（size='custom' 时生效） */
    customHeight?: string
    /** 是否全屏 */
    fullscreen?: boolean
    /** 对话框标题 */
    title?: string
    /** 底部按钮配置 */
    buttons?: DialogButton[]
    /** 是否显示头部 */
    showHeader?: boolean
    /** 是否显示底部 */
    showFooter?: boolean
    /** 内容组件（可选，优先使用 slot） */
    contentComponent?: Component
    /** 传递给内容组件的 props */
    contentProps?: Record<string, any>
  }>(),
  {
    open: false,
    showCloseButton: true,
    size: 'medium',
    customWidth: undefined,
    customHeight: undefined,
    fullscreen: false,
    showHeader: true,
    showFooter: false,
    buttons: () => [],
  }
)

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

function handleClose() {
  isOpen.value = false
}
</script>

<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <div
        v-if="isOpen"
        data-slot="dialog-overlay"
        class="data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 isolate z-50"
      />
      <DialogContent
        v-if="isOpen"
        data-slot="dialog-content"
        :class="
          cn(
            'bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 ring-foreground/10 rounded-xl text-sm ring-1 duration-100 fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 outline-none p-0',
            props.class
          )
        "
        style="min-width: 800px"
      >
        <!-- 隐藏的标题和描述，用于无障碍 -->
        <DialogTitle v-if="title" class="sr-only">{{ title }}</DialogTitle>
        <DialogDescription class="sr-only">Dialog content</DialogDescription>

        <BaseContainer
          :size="size"
          v-bind="{
            ...(customWidth ? { 'custom-width': customWidth } : {}),
            ...(customHeight ? { 'custom-height': customHeight } : {}),
          }"
          :fullscreen="fullscreen"
          class="flex flex-col max-h-[90vh]"
        >
          <!-- 头部 -->
          <div v-if="showHeader && title" class="px-6 pt-6 pb-4 border-b">
            <slot name="header">
              <h3 class="text-lg font-semibold">{{ title }}</h3>
            </slot>
          </div>

          <!-- 内容区域 -->
          <div class="flex-1 overflow-auto px-6 py-4">
            <!-- 优先使用默认插槽 -->
            <slot>
              <!-- 其次使用传入的组件 -->
              <component :is="contentComponent" v-if="contentComponent" v-bind="contentProps" />
            </slot>
          </div>

          <!-- 底部按钮 -->
          <div
            v-if="showFooter && buttons.length > 0"
            class="px-6 py-4 border-t flex justify-end gap-2"
          >
            <slot name="footer">
              <BaseButton
                v-for="(btn, index) in buttons"
                :key="index"
                :variant="btn.variant || 'default'"
                @click="btn.onClick"
              >
                {{ btn.label }}
              </BaseButton>
            </slot>
          </div>

          <!-- 关闭按钮 -->
          <DialogClose v-if="showCloseButton" data-slot="dialog-close" as-child>
            <BaseButton
              variant="ghost"
              size="icon-sm"
              class="absolute top-2 right-2"
              @click="handleClose"
            >
              <XIcon />
              <span class="sr-only">Close</span>
            </BaseButton>
          </DialogClose>
        </BaseContainer>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
