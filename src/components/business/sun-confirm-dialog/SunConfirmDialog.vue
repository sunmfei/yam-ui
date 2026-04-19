<script setup lang="ts">
/**
 * ConfirmDialog - 确认对话框组件
 *
 * 基于 shadcn-vue Dialog 和 Alert 组件封装的确认对话框
 */
import { ref, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { BaseButton } from '@/components/base'
import { AlertCircle, CheckCircle2, XCircle, Info } from 'lucide-vue-next'

export type MessageType = 'success' | 'warning' | 'error' | 'info'

interface Props {
  open?: boolean
  title?: string
  message: string
  type?: MessageType
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  title: '提示',
  type: 'info',
  confirmText: '确定',
  cancelText: '取消',
  loading: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
  cancel: []
}>()

const isOpen = ref(props.open)

// 同步外部 open 状态
watch(
  () => props.open,
  (val) => {
    isOpen.value = val
  }
)

// 同步内部 open 状态到外部
watch(isOpen, (val) => {
  emit('update:open', val)
})

// 图标映射
const iconMap = {
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle,
  info: Info,
}

const handleConfirm = () => {
  emit('confirm')
  isOpen.value = false
}

const handleCancel = () => {
  emit('cancel')
  isOpen.value = false
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
      </DialogHeader>

      <Alert :variant="type === 'error' ? 'destructive' : 'default'">
        <component :is="iconMap[type]" class="h-4 w-4" />
        <AlertTitle>{{ message }}</AlertTitle>
      </Alert>

      <DialogFooter class="gap-2 sm:gap-0">
        <BaseButton variant="outline" @click="handleCancel">
          {{ cancelText }}
        </BaseButton>
        <BaseButton
          :variant="type === 'error' ? 'destructive' : 'default'"
          :loading="loading"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </BaseButton>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
